import json
import os
import base64
import time
from http.server import BaseHTTPRequestHandler
from google import genai
from google.genai import types

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        t_start = time.time()
        print(f"[TIMING 1/5] API handler started: t=0.000s")
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length <= 0:
                self._send_json({"error": True, "code": "EMPTY_REQUEST", "message": "이미지 데이터가 전달되지 않았습니다."}, 400)
                return

            body = self.rfile.read(content_length)
            payload = json.loads(body.decode('utf-8'))
            
            image_base64 = payload.get('image', '')
            if not image_base64 or not isinstance(image_base64, str):
                self._send_json({"error": True, "code": "INVALID_IMAGE", "message": "올바른 Base64 이미지 데이터가 필요합니다."}, 400)
                return

            # Check for server-side API Key secret
            api_key = os.environ.get('GEMINI_API_KEY')
            if not api_key:
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
            except Exception:
                self._send_json({"error": True, "code": "DECODE_ERROR", "message": "이미지 디코딩에 실패했습니다."}, 400)
                return

            # Extract requested language (default: 'ko')
            lang = payload.get('lang') or payload.get('language') or 'ko'
            lang_map = {
                'ko': 'Korean',
                'en': 'English',
                'ja': 'Japanese',
                'fr': 'French'
            }
            target_lang = lang_map.get(str(lang).lower(), 'Korean')

            # Call Gemini AI Client (Server Side Only)
            client = genai.Client(api_key=api_key)
            prompt = f"""You are a world-class Spatial Design & Retail Visual Merchandising (VMD) AI Architect.
Analyze this spatial design photo and output strict valid JSON only with no markdown formatting.

CRITICAL LANGUAGE INSTRUCTIONS:
1. 'brand': Keep in original international proper noun format in English / Latin / original brand name (e.g. 'Gentle Monster', 'Chanel', 'Acne Studios', 'Independent Design'). Do NOT translate brand names.
2. All other text fields ('category', 'description', 'style', 'materials', 'lighting', 'composition', 'objects', 'theme'): Output fluently and professionally in {target_lang}.

JSON Schema:
{{
  "category": "Window" | "Store Interior" | "Store Exterior" | "Pop-up Store" | "Street" | "Exhibition",
  "brand": "Estimated Brand name or 'Independent Design'",
  "description": "2-sentence concise professional summary of the architectural and spatial design concept",
  "style": "Exact style term (e.g. Minimalist Brutalism, Biophilic Luxury, Cyberpunk Industrial, Neo-Heritage Expressionism)",
  "colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
  "materials": ["Material 1", "Material 2", "Material 3"],
  "lighting": "Lighting setup description (e.g. Dynamic Spot Accent, Warm Ambient Cove, Linear LED Outline)",
  "composition": "Compositional balance (e.g. Monolithic Center, Asymmetrical Grid, Layered Depth)",
  "objects": ["Object/Prop 1", "Object/Prop 2", "Object/Prop 3"],
  "theme": "Spatial Design Theme Title",
  "confidence": 0.92
}}"""

            t_before_api = time.time()
            print(f"[TIMING 2/5] Gemini API call starting: elapsed={t_before_api - t_start:.3f}s")

            response = client.models.generate_content(
                model='gemini-3.6-flash',
                contents=[
                    types.Part.from_bytes(
                        data=img_bytes,
                        mime_type=mime_type,
                    ),
                    prompt,
                ]
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
                    }
                    t_before_send = time.time()
                    print(f"[TIMING 5/5] Sending final HTTP 200 response: total_handler_duration={t_before_send - t_start:.3f}s")
                    self._send_json(result, 200)
                else:
                    self._send_json({"error": True, "code": "PARSE_ERROR", "message": "AI 응답 결과를 파싱할 수 없습니다."}, 500)
            else:
                self._send_json({"error": True, "code": "PARSE_ERROR", "message": "AI 응답 결과를 파싱할 수 없습니다."}, 500)

        except Exception:
            # Generic safe error message (Never expose internal exception details or key info)
            self._send_json({"error": True, "code": "AI_SERVER_ERROR", "message": "AI 공간 분석 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."}, 500)

    def _send_json(self, data, status_code):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
