import { useTheme } from '@mui/material';
import { fetchMetrics } from '../../../request';
import { createTickTimestampFormatter, dataProcessor } from '../../../util';
import { formatBytes } from '../../../util';
import Chart from '../Chart/Chart';
import { CustomTooltipFormatBytes } from '../common';

/**
 * Props for the NetworkChart component
 * @interface NetworkChartProps
 * @property {string} rxQuery - The Prometheus query to fetch network receive metrics
 * @property {string} txQuery - The Prometheus query to fetch network transmit metrics
 * @property {string} interval - The time interval for data points
 * @property {string} prometheusPrefix - The prefix for Prometheus metrics
 * @property {boolean} autoRefresh - Whether to automatically refresh the chart data
 */
interface NetworkChartProps {
  rxQuery: string;
  txQuery: string;
  interval: string;
  prometheusPrefix: string;
  autoRefresh: boolean;
}

export function NetworkChart(props: NetworkChartProps) {
  const xTickFormatter = createTickTimestampFormatter(props.interval);
  const theme = useTheme();

  return (
    <Chart
      plots={[
        {
          query: props.rxQuery,
          name: 'recieve',
          strokeColor: '#CDC300',
          fillColor: '#FFF178',
          dataProcessor: dataProcessor,
        },
        {
          query: props.txQuery,
          name: 'transmit',
          strokeColor: '#7160BB',
          fillColor: '#C2B0FF',
          dataProcessor: dataProcessor,
        },
      ]}
      xAxisProps={{
        dataKey: 'timestamp',
        tickLine: false,
        tick: props => {
          const value = xTickFormatter(props.payload.value);
          return (
            value !== '' && (
              <g
                transform={`translate(${props.x},${props.y})`}
                fill={theme.palette.chartStyles.labelColor}
              >
                <text x={0} y={10} dy={0} textAnchor="middle">
                  {value}
                </text>
              </g>
            )
          );
        },
      }}
      yAxisProps={{
        domain: ['dataMin', 'auto'],
        tick: ({ x, y, payload }) => (
          <g transform={`translate(${x},${y})`} fill={theme.palette.chartStyles.labelColor}>
            <text x={-35} y={0} dy={0} textAnchor="middle">
              {formatBytes(payload.value)}
            </text>
          </g>
        ),
        width: 80,
      }}
      fetchMetrics={fetchMetrics}
      CustomTooltip={CustomTooltipFormatBytes}
      {...props}
    />
  );
}