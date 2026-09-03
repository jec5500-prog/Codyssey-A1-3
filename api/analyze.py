import json
import os
import base64
import time
import random
from http.server import BaseHTTPRequestHandler
from google import genai
from google.genai import types

# Global in-memory IP rate limit store
RATE_LIMIT_STORE = {}
RATE_LIMIT_WINDOW = 60.0  # 60 seconds
MAX_REQUESTS_PER_IP = 15  # Max 15 requests per 60s window per IP

DEFAULT_GEMINI_MODELS = (
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-2.5-flash',
)
TRANSIENT_STATUS_CODES = {408, 429, 500, 502, 503, 504}

def is_rate_limited(ip_address: str) -> bool:
    now = time.time()
    timestamps = RATE_LIMIT_STORE.get(ip_address, [])
    valid_ts = [ts for ts in timestamps if now - ts < RATE_LIMIT_WINDOW]
    if len(valid_ts) >= MAX_REQUESTS_PER_IP:
        RATE_LIMIT_STORE[ip_address] = valid_ts
        return True
    valid_ts.append(now)
    RATE_LIMIT_STORE[ip_address] = valid_ts
    return False

def get_gemini_models():
    env_model = os.environ.get('GEMINI_MODEL')
    candidates = []
    if env_model and env_model.strip():
        candidates.append(env_model.strip())
    candidates.extend(DEFAULT_GEMINI_MODELS)
    models = []
    for m in candidates:
        if m not in models:
            models.append(m)
    return models

def get_error_status(error):
    code = getattr(error, 'status_code', None)
    if code is None:
        code = getattr(error, 'code', None)

    if isinstance(code, int):
        return code
    if isinstance(code, str) and code.isdigit():
        return int(code)

    err_str = str(error)
    if 'UNAVAILABLE' in err_str or (isinstance(code, str) and 'UNAVAILABLE' in code):
        return 503
    if 'RESOURCE_EXHAUSTED' in err_str or (isinstance(code, str) and 'RESOURCE_EXHAUSTED' in code):
        return 429

    return None

def generate_with_fallback(client, img_bytes, mime_type, prompt, request_started_at):
    models = get_gemini_models()
    total_models = len(models)
    last_exception = None

    for index, model_name in enumerate(models):
        attempt = index + 1
        elapsed = time.time() - request_started_at
        print(f"[GEMINI_ATTEMPT] Attempt {attempt}/{total_models} using model '{model_name}' | elapsed={elapsed:.3f}s")
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=[
                    types.Part.from_bytes(
                        data=img_bytes,
                        mime_type=mime_type,
                    ),
                    prompt,
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            elapsed_success = time.time() - request_started_at
            print(f"[GEMINI_SUCCESS] Model '{model_name}' succeeded on attempt {attempt}/{total_models} | elapsed={elapsed_success:.3f}s")
            return response
        except Exception as e:
            last_exception = e
            status_code = get_error_status(e)
            elapsed_fail = time.time() - request_started_at
            print(f"[GEMINI_FAILURE] Model '{model_name}' failed on attempt {attempt}/{total_models} | status={status_code} | error={type(e).__name__}: {str(e)} | elapsed={elapsed_fail:.3f}s")

            if status_code in TRANSIENT_STATUS_CODES and attempt < total_models:
                sleep_time = min(0.75 * (2 ** (attempt - 1)) + random.uniform(0, 0.25), 4.0)
                print(f"[GEMINI_RETRY] Transient error status {status_code} on attempt {attempt}. Retrying next model in {sleep_time:.3f}s...")
                time.sleep(sleep_time)
            else:
                raise e

    if last_exception:
        raise last_exception

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        t_start = time.time()
        client_ip = (
            self.headers.get('X-Forwarded-For', '').split(',')[0].strip()
            or self.headers.get('X-Real-IP', '').strip()
            or (self.client_address[0] if self.client_address else '127.0.0.1')
        )
        print(f"[API_LOG] Handler started: ip={client_ip}, path={self.path}, t=0.000s")

        # IP Rate Limit Check
        if is_rate_limited(client_ip):
            print(f"[RATE_LIMIT_EXCEEDED] IP: {client_ip} | Path: {self.path} | Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
            self._send_json({"error": True, "code": "RATE_LIMIT_EXCEEDED", "message": "API 요청 횟수가 초과되었습니다. 잠시 후 다시 시도해 주세요."}, 429)
            return

        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length <= 0:
                print(f"[ERROR] Empty request body from IP: {client_ip}")
                self._send_json({"error": True, "code": "EMPTY_REQUEST", "message": "이미지 데이터가 전달되지 않았습니다."}, 400)
                return

            body = self.rfile.read(content_length)
            payload = json.loads(body.decode('utf-8'))

            image_base64 = payload.get('image', '')
            if not image_base64 or not isinstance(image_base64, str):
                print(f"[ERROR] Invalid image data payload from IP: {client_ip}")
                self._send_json({"error": True, "code": "INVALID_IMAGE", "message": "올바른 Base64 이미지 데이터가 필요합니다."}, 400)
                return

            # Check for server-side API Key secret
            api_key = os.environ.get('GEMINI_API_KEY')
            if not api_key:
                print(f"[ERROR] Missing GEMINI_API_KEY environment variable")
                self._send_json({"error": True, "code": "MISSING_SERVER_KEY", "message": "서버 환경변수에 API 키가 설정되지 않았습니다. 후속 보안 조치 필요."}, 500)
                return

            # Parse base64 header if present
            mime_type = "image/jpeg"
            raw_b64 = image_base64
            if "," in image_base64:
                header, raw_b64 = image_base64.split(",", 1)
                if "image/png" in header:
                    mime_type = "image/png"
                elif "image/webp" in header:
                    mime_type = "image/webp"

            try:
                img_bytes = base64.b64decode(raw_b64)
            except Exception as e:
                print(f"[ERROR] Base64 decoding failed for IP: {client_ip} | Exception: {e}")
                self._send_json({"error": True, "code": "DECODE_ERROR", "message": "이미지 디코딩에 실패했습니다."}, 400)
                return

            # Extract requested language (default: 'ko')
            lang = payload.get('lang') or payload.get('language') or 'ko'
            lang_map = {
                'ko': 'Korean',
                'en': 'English',
                'ja': 'Japanese',
                'fr': 'French',
                'zh': 'Chinese',
                'es': 'Spanish'
            }
            target_lang = lang_map.get(str(lang).lower(), 'Korean')

            # Call Gemini AI Client (Server Side Only) with Forced Structured Output
            client = genai.Client(api_key=api_key)
            prompt = """You are a world-class Spatial Design & Retail Visual Merchandising (VMD) AI Architect & Translator.
Analyze this spatial design photo and output strict valid JSON only with no markdown formatting.

CRITICAL INSTRUCTIONS:
1. Canonical Master Fields: Output 'category', 'description', 'style', 'materials', 'lighting', 'composition', 'objects', and 'theme' in English canonical format.
2. 'brand': Keep in original proper noun format in English / Latin (e.g. 'Gentle Monster', 'Chanel', 'Acne Studios', 'Independent Design'). Do NOT translate brand names.
3. 'translations': Provide fluent professional translations for 'category', 'description', 'style', 'materials', 'lighting', 'composition', 'objects', and 'theme' into Korean ('ko'), Japanese ('ja'), French ('fr'), Chinese ('zh'), and Spanish ('es').

JSON Schema:
{
  "category": "Window" | "Store Interior" | "Store Exterior" | "Pop-up Store" | "Street" | "Exhibition",
  "brand": "Estimated Brand name or 'Independent Design'",
  "description": "2-sentence concise professional summary in English",
  "style": "Exact style term in English (e.g. Minimalist Brutalism, Biophilic Luxury)",
  "colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
  "materials": ["Material 1 in English", "Material 2 in English"],
  "lighting": "Lighting setup description in English",
  "composition": "Compositional balance in English",
  "objects": ["Object 1 in English", "Object 2 in English"],
  "theme": "Spatial Design Theme Title in English",
  "confidence": 0.92,
  "translations": {
    "ko": { "category": "매장 인테리어", "description": "...", "style": "...", "materials": [...], "lighting": "...", "composition": "...", "objects": [...], "theme": "..." },
    "ja": { "category": "店舗内装", "description": "...", "style": "...", "materials": [...], "lighting": "...", "composition": "...", "objects": [...], "theme": "..." },
    "fr": { "category": "Intérieur de Magasin", "description": "...", "style": "...", "materials": [...], "lighting": "...", "composition": "...", "objects": [...], "theme": "..." },
    "zh": { "category": "店铺室内", "description": "...", "style": "...", "materials": [...], "lighting": "...", "composition": "...", "objects": [...], "theme": "..." },
    "es": { "category": "Interior de Tienda", "description": "...", "style": "...", "materials": [...], "lighting": "...", "composition": "...", "objects": [...], "theme": "..." }
  }
}"""

            t_before_api = time.time()
            print(f"[TIMING 2/5] Gemini API call starting: elapsed={t_before_api - t_start:.3f}s")

            response = generate_with_fallback(
                client, img_bytes, mime_type, prompt, t_start
            )

            t_after_api = time.time()
            print(f"[TIMING 3/5] Gemini API responded: api_latency={t_after_api - t_before_api:.3f}s, elapsed={t_after_api - t_start:.3f}s")

            response_text = response.text or ""
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1

            if json_start != -1 and json_end > json_start:
                parsed_json = json.loads(response_text[json_start:json_end])

                # Strict Schema & Data Type Validation for all 11 required fields
                required_str_fields = ["category", "brand", "description", "style", "lighting", "composition", "theme"]
                required_list_fields = ["colors", "materials", "objects"]

                # 1. Check string fields
                is_valid = all(
                    field in parsed_json and isinstance(parsed_json[field], str) and len(parsed_json[field].strip()) > 0
                    for field in required_str_fields
                )

                # 2. Check list fields
                if is_valid:
                    is_valid = all(
                        field in parsed_json and isinstance(parsed_json[field], list)
                        for field in required_list_fields
                    )

                # 3. Check confidence field (must be float or int)
                if is_valid:
                    conf = parsed_json.get("confidence")
                    is_valid = isinstance(conf, (int, float)) and not isinstance(conf, bool)

                t_after_parse = time.time()
                print(f"[TIMING 4/5] JSON parsing & validation complete: parse_duration={t_after_parse - t_after_api:.3f}s, elapsed={t_after_parse - t_start:.3f}s")

                if is_valid:
                    result = {
                        "category": str(parsed_json["category"]),
                        "brand": str(parsed_json["brand"]),
                        "description": str(parsed_json["description"]),
                        "style": str(parsed_json["style"]),
                        "colors": [str(c) for c in parsed_json["colors"]],
                        "materials": [str(m) for m in parsed_json["materials"]],
                        "lighting": str(parsed_json["lighting"]),
                        "composition": str(parsed_json["composition"]),
                        "objects": [str(o) for o in parsed_json["objects"]],
                        "theme": str(parsed_json["theme"]),
                        "confidence": float(parsed_json["confidence"]),
                        "translations": parsed_json.get("translations", {}),
                    }
                    t_before_send = time.time()
                    print(f"[TIMING 5/5] Sending final HTTP 200 response: total_handler_duration={t_before_send - t_start:.3f}s, ip={client_ip}")
                    self._send_json(result, 200)
                else:
                    print(f"[ERROR] Schema validation failed for JSON response from IP: {client_ip}")
                    self._send_json({"error": True, "code": "PARSE_ERROR", "message": "AI 응답 결과를 파싱할 수 없습니다."}, 500)
            else:
                print(f"[ERROR] JSON delimiters not found in response for IP: {client_ip}")
                self._send_json({"error": True, "code": "PARSE_ERROR", "message": "AI 응답 결과를 파싱할 수 없습니다."}, 500)

        except Exception as e:
            status_code = get_error_status(e)
            print(f"[ERROR] Exception caught in API handler | IP: {client_ip} | status={status_code} | Exception: {type(e).__name__}: {str(e)}")
            if status_code in TRANSIENT_STATUS_CODES:
                self._send_json({
                    "error": True,
                    "code": "AI_TEMPORARILY_UNAVAILABLE",
                    "message": "AI 서비스가 일시적으로 혼잡합니다. 잠시 후 다시 시도해 주세요.",
                    "retryable": True
                }, 503)
            else:
                self._send_json({
                    "error": True,
                    "code": "AI_SERVER_ERROR",
                    "message": "AI 공간 분석 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
                }, 500)

    def _send_json(self, data, status_code):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
