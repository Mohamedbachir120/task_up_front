import React, { useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    
    Title,
    Tooltip,
    Filler,
    Legend,
  } from 'chart.js';
  import { Doughnut, Line } from 'react-chartjs-2';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import { usePerformanceMutation } from '../../features/task/task';
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ArcElement,
    Tooltip,
    Filler,
    Legend
  );
  
function PerformancePage() {
    const [getPerformance] = usePerformanceMutation()
    const [labelStatus,setLabelStatus] = useState<string[]>([])
    const [dataStatus,setDataStatus] = useState<number[]>([])

    useEffect(()=>{

    async function  fetchData(){
       const {label_data_month,label_data_projects,label_data_status,data_month,data_projects,data_status}  = await getPerformance({}).unwrap();
        
       setLabelStatus(label_data_status);
       setDataStatus(data_status);
        

    }
    fetchData();

    },[])
  return (
    <div>
        <SideBar active="performances" isOpened={true} /> 
         <Header />
         <div className="col card mx-2">
         <Doughnut data={
            {
              
           labels:labelStatus,
            datasets: [
              {
                label: 'Server',
                data:  dataStatus ,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
              },
            ],}} />
         </div>
    </div>
  )
}

export default PerformancePage