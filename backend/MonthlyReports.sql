use st;
CREATE TABLE MonthlyReports (
    ReportID INT AUTO_INCREMENT PRIMARY KEY,
    ReportMonth VARCHAR(7),  -- YYYY-MM format
    PurchasesTotalAmount DECIMAL(10, 2),
    SalesTotalAmount DECIMAL(10, 2),
    NetProfitLoss DECIMAL(10, 2),
    TotalGSTCollected DECIMAL(10, 2),
    TotalGSTPaid DECIMAL(10, 2),
    TotalExpenses DECIMAL(10, 2),
    ReportGeneratedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (ReportMonth)  -- Ensures there is only one report per month
);
-- This query will aggregate the Purchaser and Seller data
-- and either insert or update the MonthlyReports table
INSERT INTO MonthlyReports (ReportMonth, PurchasesTotalAmount, SalesTotalAmount, NetProfitLoss, TotalGSTCollected, TotalGSTPaid, TotalExpenses)
SELECT
    DATE_FORMAT(p.PaymentDate, '%Y-%m') AS ReportMonth,
    SUM(p.Amount) AS PurchasesTotalAmount,
    SUM(s.Amount) AS SalesTotalAmount,
    SUM(p.Amount) - SUM(s.Amount) AS NetProfitLoss,
    SUM(s.GST) AS TotalGSTCollected,
    SUM(p.GST) AS TotalGSTPaid,
    SUM(p.Hamali + p.Cartage + p.ShopExpenses + p.OtherExpenses) AS TotalExpenses
FROM Purchaser p
LEFT JOIN Seller s ON p.LotNumber = s.LotNumber
WHERE p.PaymentDate IS NOT NULL
GROUP BY DATE_FORMAT(p.PaymentDate, '%Y-%m')
ON DUPLICATE KEY UPDATE
    PurchasesTotalAmount = VALUES(PurchasesTotalAmount),
    SalesTotalAmount = VALUES(SalesTotalAmount),
    NetProfitLoss = VALUES(NetProfitLoss),
    TotalGSTCollected = VALUES(TotalGSTCollected),
    TotalGSTPaid = VALUES(TotalGSTPaid),
    TotalExpenses = VALUES(TotalExpenses);
