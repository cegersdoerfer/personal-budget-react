import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";


function Chart1() {
    const [dataSource, setDataSource] = useState({
        datasets: [{ data: [], backgroundColor: [] }],
        labels: []
    });
    Chart.register(CategoryScale);
    
    useEffect(() => {
        async function getBudget() {
            try {
                const res = await axios.get('http://localhost:3000/budget');
                const budgetData = res.data.myBudget;

                var newData = {
                    datasets: [{
                        data: [],
                        backgroundColor: []
                    }],
                    labels: []
                };
                for (var i = 0; i < budgetData.length; i++) {
                    newData.datasets[0].data[i] = res.data.myBudget[i].budget;
                    newData.labels[i] = res.data.myBudget[i].title;
                    newData.datasets[0].backgroundColor[i] = res.data.myBudget[i].color;
                    };

                setDataSource(newData);
            } catch (error) {
                console.error("Error fetching budget data:", error);
            }
        }

        getBudget();
    }, []);

    return <Pie data={dataSource} />;
}

export default Chart1;

