
import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export function RadialScore({ value }: { value: number }) {
  const data = [{ name: 'IPSS', value }];
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="40%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <RadialBar minAngle={15} background clockWise dataKey="value" fill="#0ea5e9" />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
