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
    BarElement,
  } from 'chart.js';
  import { Bar, Doughnut, Line } from 'react-chartjs-2';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import { usePerformanceMutation } from '../../features/task/task';
import { useAppSelector } from '../hooks';
import { MainUiState } from '../../features/mainUi';
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ArcElement,
    Tooltip,
    Filler,
    Legend,
    BarElement
  );
  
function PerformancePage() {
    const [getPerformance] = usePerformanceMutation()
    const [labelStatus,setLabelStatus] = useState<string[]>([])
    const [dataStatus,setDataStatus] = useState<number[]>([])
    const [labelMonth,setLabelMonth] = useState<string[]>([])
    const [dataMonth,setDataMonth] = useState<number[]>([])
    const [labelProjects,setLabelProjects] = useState<string[]>([])
    const [dataProjects,setDataProjects] = useState<number[]>([])
    const mainUi = useAppSelector((state:{mainUi:MainUiState})=> state.mainUi)
    useEffect(()=>{

    async function  fetchData(){
       const {label_data_month,label_data_projects,label_data_status,data_month,data_projects,data_status}  = await getPerformance({}).unwrap();
        
       setLabelStatus(label_data_status);
       setDataStatus(data_status);
       setDataMonth(data_month);
       setLabelMonth(label_data_month);
      setLabelProjects(label_data_projects);
      setDataProjects(data_projects);  

    }
    fetchData();

    },[])
  return (
    <div>
        <SideBar active="performances" isOpened={true} /> 
         <Header />
         <div className={`d-flex flex-row ${mainUi.margin_left} justify-content-between `}>
         <div className='col-7   mx-2 pt-2'>
         <Line  options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: 'Nombre de tâches par mois',
                },
              },
            }}  data={ 
              {

              labels:labelMonth ,
            datasets: [
              {
                tension:0.5,
                fill: true,
                label: 'Tâche',
                data:  dataMonth ,
                borderColor: '#50A060',
                backgroundColor: '#50A0606e',
              },
            ],
          }
            
            } />
          </div> 
         <div className="col-3 border-start border-bottom p-2 mx-2">
         <Doughnut  
         options={{
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text: 'Nombre de tâches par status',
            },
          },
         }

         }
         data={
            {
              
           labels:labelStatus,
           
            datasets: [
              {
              
                label: 'Tâches',
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
         <div className={`d-flex flex-row ${mainUi.margin_left} justify-content-between `}>
          <div className='col-10 p-3'>
            <Bar
            data={{
              labels:labelProjects,
              datasets:[
                {
              
                  label: 'Projets',
                  data:  dataProjects ,
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
              ]
            }}
            />
            </div>
          </div>
    </div>
  )
}

export default PerformancePage