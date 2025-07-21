import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';  // Import Bar chart component
import styles from './ReportPage.css';  // Import the CSS Module
import { exportToPDF, exportToExcel } from '../../utils/ReportExport';
import { formatCurrency } from '../../utils/formatINR';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportPage = () => {
    const [reportData, setReportData] = useState({});
    const [month, setMonth] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        return `${year}-${month}`;
      });
        // Default month
    const [loading, setLoading] = useState(false);
    const [showExportOptions, setShowExportOptions] = useState(false);  // State to toggle export options


    // Fetch the report data based on the selected month
    useEffect(() => {
        fetchReportData(month);
    }, [month]);

    // Function to fetch the report data
    const fetchReportData = async (month) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/reports?month=${month}`);
            setReportData(response.data);
        } catch (error) {
            console.error('Error fetching report data:', error);
            alert('Error fetching report data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const getProfitLossColor = (netProfitLoss,GrossProfitLoss) => {
      return parseFloat(netProfitLoss,GrossProfitLoss) >= 0 ? 'green' : 'red';
    };

    const handleGenerateReport = () => {
      setShowExportOptions(true);  // Show the export options
    };

    const hamali = parseFloat(reportData.Hamali) || 0;
    const shopExpenses = parseFloat(reportData.ShopExpenses) || 0;
    const cartage = parseFloat(reportData.Cartage) || 0;
    const lorryFright = parseFloat(reportData.LorryFright) || 0;
    const otherExpenses = parseFloat(reportData.OtherExpenses) || 0;

    const totalExpenses = (hamali + shopExpenses + cartage + otherExpenses + lorryFright).toFixed(2);
    const GrossProfitLoss = reportData.SalesTotalAmount - reportData.PurchasesTotalAmount; 
    const netProfitLoss = reportData.SalesTotalAmount - reportData.PurchasesTotalAmount - totalExpenses;

    const formatMonth = (monthString) => {
      const date = new Date(monthString);
      const options = { year: 'numeric', month: 'long' };  // For full month name and year
      return new Intl.DateTimeFormat('en-US', options).format(date);
  };

    // Chart data for Purchases, Sales, and Net Profit/Loss
    const chartData = {
      labels: ['Purchases', 'Sales','Gross P & L', 'Net P & L'],
      datasets: [
          {
              label: '₹',
              data: [
                  reportData.PurchasesTotalAmount,
                  reportData.SalesTotalAmount,
                  GrossProfitLoss,
                  netProfitLoss,
              ],
              backgroundColor: '#457b9d',  // Single color for the bar
              borderColor: '#1d3557',  // Darker border color
              borderWidth: 1
          }
      ]
  };

    return (
        <div className='main-report-container'>
            <div className={styles['report-container']}>
                <h1>Monthly Report</h1>

                <div className={styles['month-selector']}>
                    <label>Select Month:</label>
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p className={styles['loader']}>Loading...</p>
                ) : (
                    <div>
                        <div className={styles['report-summary']}>
                            <h2>Report Summary for {formatMonth(month)}</h2>
                            <p><strong>Total Purchases:</strong> {formatCurrency(reportData.PurchasesTotalAmount) || 0}</p>
                            <p><strong>Total Sales:</strong> {formatCurrency(reportData.SalesTotalAmount) || 0}</p>
                            <p><strong>Total GST Collected:</strong> {formatCurrency(reportData.TotalGSTCollected) || 0}</p>
                            <p><strong>Total GST Paid:</strong> {formatCurrency(reportData.TotalGSTPaid) || 0}</p>
                            <p><strong>Total Expenses:</strong> {formatCurrency(totalExpenses) || 0}</p>
                            <p>
                                <strong>Gross Profit/Loss:</strong>
                                <span style={{ color: getProfitLossColor(GrossProfitLoss) }}>
                                    {formatCurrency(GrossProfitLoss)}
                                </span>
                            </p>
                            <p>
                                <strong>Net Profit/Loss:</strong>
                                <span style={{ color: getProfitLossColor(netProfitLoss) }}>
                                    {formatCurrency(netProfitLoss)}
                                </span>
                            </p>
                        </div>

                        <div className={styles['expense-breakdown']}>
                            <h3>Expense Breakdown</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Expense Type</th>
                                        <th>Amount (INR)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Hamali</td>
                                        <td>{formatCurrency(reportData.Hamali) || 0}</td>
                                    </tr>
                                    <tr>
                                        <td>Shop Expenses</td>
                                        <td>{formatCurrency(reportData.ShopExpenses) || 0}</td>
                                    </tr>
                                    <tr>
                                        <td>Cartage</td>
                                        <td>{formatCurrency(reportData.Cartage) || 0}</td>
                                    </tr>
                                    <tr>
                                        <td>Lorry Fright</td>
                                        <td>{formatCurrency(reportData.LorryFright) || 0}</td>
                                    </tr>
                                    <tr>
                                        <td>Other Expenses</td>
                                        <td>{formatCurrency(reportData.OtherExpenses) || 0}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className={styles['gst-analysis']}>
                            <h3>GST Analysis</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>GST Type</th>
                                        <th>Amount (INR)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>GST Collected</td>
                                        <td>{formatCurrency(reportData.TotalGSTCollected) || 0}</td>
                                    </tr>
                                    <tr>
                                        <td>GST Paid</td>
                                        <td>{formatCurrency(reportData.TotalGSTPaid) || 0}</td>
                                    </tr>
                                    <tr>
                                        <td>Net GST</td>
                                        <td>{formatCurrency(reportData.TotalGSTCollected - reportData.TotalGSTPaid) || 0}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* <div className={styles['chart-container']}>
                        <Bar data={chartData} />
                    </div> */}


                        {/* <button onClick={handleGenerateReport}>Generate Report</button> */}
                        <div className='button-container'>
                            <button onClick={() => { exportToPDF(reportData, month); setShowExportOptions(false); }}>
                                Generate PDF
                            </button>
                        </div>

                        {/* Show export options as a dropdown */}
                        {/* {showExportOptions && (
                        <div className={styles['export-options-dropdown']}>
                            <button onClick={() => { exportToPDF(reportData, month); setShowExportOptions(false); }}>
                                Export to PDF
                            </button>
                            <button onClick={() => { exportToExcel(reportData, month); setShowExportOptions(false); }}>
                                Export to Excel
                            </button>
                        </div>
                    )} */}


                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportPage;
