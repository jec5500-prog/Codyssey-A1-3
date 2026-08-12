'use client';

import React, { useState, useEffect } from 'react';
import { getSpots } from '@/lib/services/dbService';
import InsightDashboard from '@/components/insight/InsightDashboard';

export default function InsightPage() {
  const [countries, setCountries] = useState<string[]>(['Japan', 'France', 'South Korea', 'United States', 'United Kingdom', 'Italy']);

  useEffect(() => {
    async function loadCountries() {
      const spots = await getSpots();
      const unique = Array.from(new Set(spots.map((s) => s.country)));
      if (unique.length > 0) {
        setCountries(unique);
      }
    }
    loadCountries();
  }, []);

  return <InsightDashboard availableCountries={countries} />;
}
