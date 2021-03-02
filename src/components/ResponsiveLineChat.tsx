import { Line, LinearComponentProps } from "react-chartjs-2";
export const ResponsiveLineChart = ({
  lineProps,
  device,
  GraphHeight,
}: {
  lineProps: LinearComponentProps;
  device: string;
  GraphHeight: number;
}) => {
  const labelProps: LinearComponentProps = {
    ...lineProps,
  };
  if (labelProps.options?.scales?.xAxes?.[0]) {
    labelProps.options = JSON.parse(JSON.stringify(labelProps.options));
    labelProps.options.scales.xAxes[0] = {
      ...labelProps.options.scales.xAxes[0],
      ticks: {
        fontColor: "white",
      },
    };
  }

  return (
    <div>
      {device === "mobile" ? (
        <div style={{ position: "relative" }}>
          <div
            style={{ position: "relative", width: "100%", overflowX: "auto" }}
          >
            <div style={{ height: GraphHeight, width: 600 }}>
              <Line {...lineProps} />
            </div>
          </div>
          <div
            style={{
              height: GraphHeight,
              width: 33,
              background: "white",
              pointerEvents: "none",
              overflow: "hidden",
              position: "absolute",
              left: 0,
              top: 0,
            }}
          >
            <div style={{ height: GraphHeight, width: 600 }}>
              <Line {...labelProps} />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ height: GraphHeight }}>
          <Line {...lineProps} />
        </div>
      )}
    </div>
  );
};
