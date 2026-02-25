import { ResponsiveBar } from "@nivo/bar";
import { nivoTheme } from "../utils/transforms";
import type { RiskBarDatum } from "../types";
import { Card, CardContent } from "@/core/components/ui/Card";
import { Typography } from "@/core/components/ui";

export function RiskAmountBar({ data }: { data: RiskBarDatum[] }) {
  return (
    <Card className="shadow-sm col-span-1 md:col-span-1 xl:col-span-1 flex flex-col">
      <CardContent className="p-4 flex flex-col flex-1">
        <Typography
          variant="caption"
          className="text-primary font-medium uppercase mb-2"
        >
          Distribuição de Risco
        </Typography>

        {/* container que ocupa o resto */}
        <div className="flex-1 w-full">
          <ResponsiveBar
            data={data}
            keys={["percentage"]}
            indexBy="category"
            layout="vertical"
            margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
            padding={0.3}
            colors={({ data }) => data.color as string}
            theme={nivoTheme}
            enableGridY
            enableGridX={false}
            axisBottom={{
              tickSize: 0,
              tickPadding: 8,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 5,
              format: (value) => `${value}%`,
            }}
            label={({ data }) => `${data.percentage}%`}
            labelSkipHeight={12}
            labelTextColor="#ffffff"
            tooltip={({ data }) => (
              <div className="rounded bg-white p-2 shadow border text-xs">
                <strong>{data.category}</strong>
                <div>{data.count} pacientes</div>
                <div>{data.percentage}%</div>
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
