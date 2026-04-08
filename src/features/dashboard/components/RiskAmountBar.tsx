import { ResponsiveBar } from "@nivo/bar";
import { nivoTheme, riskColorMap } from "../utils/transforms";
import type { RiskBarDatum } from "../types";
import { Card, CardContent } from "@/core/components/ui/Card";
import { Box, Typography } from "@/core/components/ui";
import { calcPercentage } from "../utils/transforms";

type RiskAmountBarProps = {
  data: RiskBarDatum[];
  total: number;
  isCompact?: boolean;
};

export function RiskAmountBar({
  data,
  total,
  isCompact = false,
}: RiskAmountBarProps) {
  const dataWithPercentages = data.map((item) => ({
    ...item,
    percentage: calcPercentage(item.count, total ?? 1),
  }));

  const fragileSeparatorLayer = ({ bars, innerHeight }: any) => {
    const fragileBars = bars.filter((bar: any) => {
      const category = String(bar?.data?.indexValue ?? "").toLowerCase();
      return category === "fragil" || category === "frágil";
    });

    if (!fragileBars.length) return null;

    const fragileBar = fragileBars.reduce((acc: any, current: any) =>
      current.x < acc.x ? current : acc,
    );

    const barsOnLeft = bars.filter((bar: any) => bar.x < fragileBar.x);
    const nearestLeftBar = barsOnLeft.reduce(
      (acc: any, current: any) => (!acc || current.x > acc.x ? current : acc),
      null,
    );

    const barsOnRight = bars.filter((bar: any) => bar.x > fragileBar.x);
    const nearestRightBar = barsOnRight.reduce(
      (acc: any, current: any) => (!acc || current.x < acc.x ? current : acc),
      null,
    );

    let separatorX = fragileBar.x;

    if (nearestLeftBar) {
      const leftEnd = nearestLeftBar.x + nearestLeftBar.width;
      const rightStart = fragileBar.x;
      separatorX = leftEnd + (rightStart - leftEnd) / 2;
    } else if (nearestRightBar) {
      const leftEnd = fragileBar.x + fragileBar.width;
      const rightStart = nearestRightBar.x;
      separatorX = leftEnd + (rightStart - leftEnd) / 2;
    }

    return (
      <line
        x1={separatorX}
        x2={separatorX}
        y1={0}
        y2={innerHeight}
        stroke="#dc2626"
        strokeWidth={1}
        strokeDasharray="6 6"
      />
    );
  };

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
        <div className={`flex-1 w-full ${isCompact ? "min-h-60" : "min-h-75"}`}>
          <ResponsiveBar
            data={dataWithPercentages}
            keys={["percentage"]}
            indexBy="category"
            layout="vertical"
            margin={
              isCompact
                ? { top: 12, right: 10, bottom: 30, left: 35 }
                : { top: 20, right: 20, bottom: 40, left: 50 }
            }
            padding={0.3}
            colors={({ data }) => riskColorMap[data.category]}
            theme={nivoTheme}
            enableGridY
            enableGridX={false}
            axisBottom={{
              tickSize: 0,
              tickPadding: 8,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: isCompact ? 2 : 5,
              format: (value) => `${value}%`,
            }}
            enableLabel={!isCompact}
            label={({ data }) => `${data.percentage}%`}
            labelSkipHeight={12}
            labelTextColor="#ffffff"
            layers={[
              "grid",
              "axes",
              "bars",
              "markers",
              fragileSeparatorLayer,
              "legends",
              "annotations",
            ]}
            tooltip={({ data }) => (
              <Box
                display="flex"
                direction="column"
                align="center"
                p={5}
                className="bg-background rounded w-30 border"
              >
                <Typography color="secondary" variant="body">
                  {data.category}
                </Typography>
                <Typography color="secondary" variant="caption">
                  {data.count} pacientes
                </Typography>
                <Typography color="secondary" variant="caption">
                  {data.percentage}%
                </Typography>
              </Box>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
