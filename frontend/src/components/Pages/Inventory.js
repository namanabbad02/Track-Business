import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Card, Table, notification, Spin } from 'antd';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import {jwtDecode} from 'jwt-decode';


// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const InventoryPage = () => {
  const [LotNumber, setLotNumber] = useState('');
  const [specificInventory, setSpecificInventory] = useState(null);
  const [overallInventory, setOverallInventory] = useState(null);
  const [detailedInventory, setDetailedInventory] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch inventory data
  // const fetchInventoryData = async (LotNumber) => {
  //   setLoading(true);

  //   try {
  //     const endpoint = LotNumber
  //       ? `http://localhost:5000/api/inventory-data/${LotNumber}`
  //       : `http://localhost:5000/api/inventory-data`;

  //     const response = await axios.get(endpoint);

  //     if (response.status === 200) {
  //       if (LotNumber) {
  //         if (!response.data.inventory || response.data.inventory.length === 0) {
  //           notification.warning({
  //             message: 'No Data Found',
  //             description: `No inventory data available for Lot Number: ${LotNumber}`,
  //           });
  //           setSpecificInventory(null);
  //         } else {
  //           setSpecificInventory(response.data.inventory);
  //         }
  //       } else {
  //         setOverallInventory(response.data.overallInventory);
  //         setDetailedInventory(response.data.detailedInventory);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching inventory data:', error);
  //     notification.error({
  //       message: 'Data Fetch Error',
  //       description: error.message || 'Failed to fetch inventory data.',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchInventoryData = async (LotNumber) => {
    setLoading(true);
  
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const adminId = decoded.adminId || decoded.id; // fallback for different token structures
  
      if (!adminId) {
        throw new Error('Admin ID not found in token.');
      }
  
      const endpoint = LotNumber
        ? `http://localhost:5000/api/inventory-data/${LotNumber}?adminId=${adminId}`
        : `http://localhost:5000/api/inventory-data?adminId=${adminId}`;
  
      const response = await axios.get(endpoint);
  
      if (response.status === 200) {
        if (LotNumber) {
          if (!response.data.inventory || response.data.inventory.length === 0) {
            notification.warning({
              message: 'No Data Found',
              description: `No inventory data available for Lot Number: ${LotNumber}`,
            });
            setSpecificInventory(null);
          } else {
            setSpecificInventory(response.data.inventory);
          }
        } else {
          setOverallInventory(response.data.overallInventory);
          setDetailedInventory(response.data.detailedInventory);
        }
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      notification.error({
        message: 'Data Fetch Error',
        description: error.message || 'Failed to fetch inventory data.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch overall inventory data on page load
  useEffect(() => {
    fetchInventoryData();
  }, []);

  const getColor = (value) => {
    if (value < 0) {
      return 'red';
    } else if (value > 0) {
      return 'green';
    } else {
      return 'black'; // Optional: for value === 0
    }
  };
  

  // Generate Pie Chart Data
  const generatePieChartData = (data, title) => {
    if (!data) return null;

    return {
      labels: ['Balance Bales', 'Balance Quantity'],
      datasets: [
        {
          label: title,
          data: [data.BalanceBales || data.TotalBalanceBales || 0, data.BalanceQuantity || data.TotalBalanceQuantity || 0],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Input field for LotNumber */}
      <div className='Input-entry'>
      <Input
        placeholder="Enter Lot Number"
        value={LotNumber}
        onChange={(e) => setLotNumber(e.target.value)}
        style={{ width: '300px', marginBottom: '20px' }}
      />
      <Button
        onClick={() => fetchInventoryData(LotNumber)}
        type="primary"
        loading={loading}
        style={{ marginLeft: '10px' }}
        // disabled={loading || LotNumber.length !== 4} // Enable button only for valid 3-digit LotNumber
      >
        Fetch Data
      </Button>
      </div>

      {/* Overall inventory details */}
      {overallInventory && (
        <Card style={{ marginTop: '30px', position: 'relative' }} title="Stock In Godown">
          
          <p>
            <strong>Total Balance Bales:</strong> {overallInventory.TotalBalanceBales || 0}
          </p>
          <p>
            <strong>Total Balance Quantity:</strong> {overallInventory.TotalBalanceQuantity || 0}
          </p>
          
          {/* Pie Chart for Overall Inventory */}
          {/* <div style={{ width: '400px', margin: '20px auto' }}>
            <Pie data={generatePieChartData(overallInventory, 'Overall Inventory')} />
          </div> */}
          
        </Card>
        
      )}
    
      {/* Specific inventory details */}
      {specificInventory && (
        <Card style={{ marginTop: '30px' }} title={`Stock Detail for Lot Number: ${LotNumber}`}>
          <Table
            columns={[
              { title: 'Lot Number', dataIndex: 'LotNumber', key: 'LotNumber', 
                render: (text) => ( <span style={{ fontWeight:'bold' }}>{text}</span>)
              },
              { title: 'Balance Bales', dataIndex: 'BalanceBales', key: 'BalanceBales',
                render: (text) => ( <span style={{ color: getColor(text), fontWeight:'bold' }}>{text}</span>)
               },
              { title: 'Balance Quantity', dataIndex: 'BalanceQuantity', key: 'BalanceQuantity',
                render: (text) => ( <span style={{ color: getColor(text), fontWeight:'bold' }}>{text}</span>)
               },
            ]}
            dataSource={specificInventory}
            rowKey="LotNumber"
            pagination={false}
            bordered
            loading={loading}
            
          />

          {/* Pie Chart for Specific Inventory */}
          {/* <div style={{ width: '400px', margin: '20px auto' }}>
            <Pie data={generatePieChartData(specificInventory[0], `Lot Number: ${LotNumber}`)} />
          </div> */}
        </Card>
      )}

      {/* Detailed Inventory Table */}
      {detailedInventory && (
        <Card style={{ marginTop: '30px'}} title="All Stock Details">
          
          <Table
            columns={[
              { title: 'Lot Number', dataIndex: 'LotNumber', key: 'LotNumber',
                render: (text) => ( <span style={{ fontWeight:'bold' }}>{text}</span>)
               },
              { title: 'Balance Bales', dataIndex: 'BalanceBales', key: 'BalanceBales', 
                render: (text) => ( <span style={{ color: getColor(text), fontWeight:'bold' }}>{text}</span>), },
              { title: 'Balance Quantity', dataIndex: 'BalanceQuantity', key: 'BalanceQuantity',
                render: (text) => ( <span style={{ color: getColor(text), fontWeight:'bold' }}>{text}</span>),
               },
            ]}
            dataSource={detailedInventory}
            rowKey="LotNumber"
            pagination={{ pageSize: 10 }}
            bordered
            loading={loading}
            // scroll={{x: 300, y: 240}}
          />
        </Card>
      )}

      {/* Loading spinner */}
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
