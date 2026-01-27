import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface EngagementChartProps {
  data: { name: string; views: number; likes: number }[];
}

export const EngagementChart = ({ data }: EngagementChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="h-[280px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(330, 81%, 71%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(330, 81%, 71%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(45, 100%, 66%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(45, 100%, 66%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(330, 20%, 90%)" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: "hsl(330, 10%, 45%)" }}
            axisLine={{ stroke: "hsl(330, 20%, 90%)" }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "hsl(330, 10%, 45%)" }}
            axisLine={{ stroke: "hsl(330, 20%, 90%)" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(330, 20%, 90%)",
              borderRadius: "12px",
              boxShadow: "0 10px 40px hsl(330, 81%, 71%, 0.1)"
            }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="hsl(330, 81%, 71%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorViews)"
          />
          <Area
            type="monotone"
            dataKey="likes"
            stroke="hsl(45, 100%, 66%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorLikes)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
