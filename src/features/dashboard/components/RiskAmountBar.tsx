import { BarItem, ResponsiveBar } from "@nivo/bar";
import { nivoTheme, riskColorMap } from "../utils/transforms";
import type { RiskBarDatum } from "../types";
import { Card, CardContent } from "@/core/components/ui/Card";
import { Box, Typography } from "@/core/components/ui";
import { calcPercentage } from "../utils/transforms";

type RiskAmountBarProps = {
  data: RiskBarDatum[];
  total: number;
  isCompact?: boolean;
  onBarClick?: (datum: RiskBarDatum) => void;
};

export function RiskAmountBar({
  data,
  total,
  isCompact = false,
  onBarClick,
}: RiskAmountBarProps) {
  const dataWithPercentages = data.map((item) => ({
    ...item,
    percentage: calcPercentage(item.count, total ?? 1),
  }));

  const max = Math.max(...dataWithPercentages.map((d) => d.percentage));

  const riskBackgroundLayer = ({ bars, innerHeight, innerWidth }: any) => {
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
      <g>
        {/* Fundo verde - Baixo risco */}
        <rect
          x={0}
          y={0}
          width={separatorX}
          height={innerHeight}
          fill="#10b981"
          fillOpacity={0.1}
        />

        {/* Fundo vermelho - Alto risco */}
        <rect
          x={separatorX}
          y={0}
          width={innerWidth - separatorX}
          height={innerHeight}
          fill="#dc2626"
          fillOpacity={0.1}
        />
      </g>
    );
  };

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
      <g>
        {/* Linha tracejada */}
        <line
          x1={separatorX}
          x2={separatorX}
          y1={0}
          y2={innerHeight}
          stroke="#dc2626"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          strokeOpacity={0.7}
        />

        {/* Label "Alto risco" no topo direito da linha */}
        <g transform={`translate(${separatorX + 6}, 0)`}>
          <rect
            x={0}
            y={0}
            width={72}
            height={18}
            rx={4}
            fill="#dc2626"
            fillOpacity={0.1}
          />
          <text
            x={36}
            y={12}
            textAnchor="middle"
            fill="#dc2626"
            fontSize={10}
            fontWeight={600}
            letterSpacing={0.3}
            style={{ fontFamily: "inherit" }}
          >
            Alto risco
          </text>
        </g>
      </g>
    );
  };

  return (
    <Card className="group relative col-span-1 flex flex-col overflow-hidden border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:col-span-1 xl:col-span-1">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary/70" />

      <CardContent className="flex flex-1 flex-col p-5 pt-6">
        <Typography
          variant="caption"
          className="mb-1 font-medium uppercase tracking-wide text-primary"
        >
          Distribuição de Risco
        </Typography>
        <Typography variant="caption" className="text-muted-foreground">
          Percentual por classificação clínica na amostra filtrada.
        </Typography>

        <div
          className={`mt-3 flex-1 w-full rounded-xl border border-border/60 bg-muted/20 p-2 ${
            isCompact ? "min-h-60" : "min-h-75"
          }`}
        >
          <ResponsiveBar
            data={dataWithPercentages}
            keys={["percentage"]}
            indexBy="category"
            layout="vertical"
            margin={
              isCompact
                ? { top: 28, right: 10, bottom: 30, left: 35 }
                : { top: 36, right: 20, bottom: 40, left: 50 }
            }
            valueScale={{ type: "linear", max: max * 1.05 }}
            padding={0.35}
            innerPadding={0}
            borderRadius={5}
            colors={({ data }) => riskColorMap[data.category]}
            borderWidth={0}
            theme={nivoTheme}
            enableGridY
            gridYValues={4}
            enableGridX={false}
            axisBottom={{
              tickSize: 0,
              tickPadding: 10,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: isCompact ? 4 : 8,
              tickValues: 4,
              format: (value) => `${value}%`,
            }}
            enableLabel={!isCompact}
            label={({ data }) => `${data.percentage}%`}
            labelSkipHeight={16}
            labelTextColor="#ffffff"
            onClick={(bar) => onBarClick?.(bar.data as RiskBarDatum)}
            layers={[
              riskBackgroundLayer,
              "grid",
              "axes",
              "bars",
              "markers",
              fragileSeparatorLayer,
              "legends",
              "annotations",
            ]}
            barComponent={(props) => (
              <g style={{ cursor: "pointer" }}>
                <BarItem {...props} />
              </g>
            )}
            tooltip={({ data }) => (
              <Box
                display="flex"
                direction="column"
                align="center"
                p={5}
                className="w-32 rounded-lg border border-border/60 bg-background shadow-md"
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
