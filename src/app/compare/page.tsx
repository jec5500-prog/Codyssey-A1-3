'use client';

import React, { useState, useEffect } from 'react';
import { getSpots } from '@/lib/services/dbService';
import CompareEngine from '@/components/compare/CompareEngine';

export default function ComparePage() {
  const [locations, setLocations] = useState<string[]>(['Tokyo', 'Paris', 'Seoul', 'New York', 'London', 'Milan']);

  useEffect(() => {
    async function loadLocations() {
      const spots = await getSpots();
      const cities = spots.map((s) => s.city);
      const countries = spots.map((s) => s.country);
      const unique = Array.from(new Set([...cities, ...countries]));
      if (unique.length > 0) {
        setLocations(unique);
      }
    }
    loadLocations();
  }, []);

  return <CompareEngine availableLocations={locations} />;
}
