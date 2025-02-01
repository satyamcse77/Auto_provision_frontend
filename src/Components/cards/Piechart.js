import React,{useState,useEffect} from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const PieChartComponent = ({ memUsage, title, used,unused }) => {

  const value = parseFloat(memUsage);
  const [color, setColor] = useState("#0088FE");
  const COLORS = [color, '#00C49F'];
  const pieData = [
    { name: used, value },
    { name: unused, value: 100 - value }
  ];

  useEffect(() => {

    if(memUsage > '85%'){
      setColor('red');
    }else{
      setColor('#0088FE')
    }

  }, [setColor,memUsage]);

  const renderCustomLabel = ({ percent }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div style={{ padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h5>{title}</h5>
      <PieChart width={296} height={340}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={70}
          fill="#8884d8"
          dataKey="value"
          stroke={color}  
          strokeWidth={0.2} 
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
