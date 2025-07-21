use st;
CREATE TABLE Inventory (
    LotNumber INT PRIMARY KEY,
    BalanceBales INT NOT NULL,
    BalanceQuantity DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (LotNumber) REFERENCES Lots(LotNumber)
);

-- DELIMITER $$

-- CREATE TRIGGER after_purchaser_insert_update
-- AFTER INSERT ON Purchaser
-- FOR EACH ROW
-- BEGIN
--     INSERT INTO Inventory (LotNumber, BalanceBales, BalanceQuantity)
--     VALUES (
--         NEW.LotNumber,
--         NEW.NumberOfBales,
--         NEW.Quantity
--     )
--     ON DUPLICATE KEY UPDATE
--         BalanceBales = BalanceBales + NEW.NumberOfBales,
--         BalanceQuantity = BalanceQuantity + NEW.Quantity;
-- END$$

-- DELIMITER ;

-- DELIMITER $$

-- CREATE TRIGGER after_seller_insert_update
-- AFTER INSERT ON Seller
-- FOR EACH ROW
-- BEGIN
--     UPDATE Inventory
--     SET 
--         BalanceBales = BalanceBales - NEW.NumberOfBales,
--         BalanceQuantity = BalanceQuantity - NEW.Quantity
--     WHERE LotNumber = NEW.LotNumber;
-- END$$

-- DELIMITER ;

-- DROP TRIGGER IF EXISTS after_purchaser_insert_update;
-- DROP TRIGGER IF EXISTS after_seller_insert_update;


-- INSERT INTO Inventory (LotNumber, BalanceBales, BalanceQuantity)
-- SELECT 
--     l.LotNumber,
--     COALESCE(SUM(p.NumberOfBales), 0) - COALESCE(SUM(s.NumberOfBales), 0) AS BalanceBales,
--     COALESCE(SUM(p.Quantity), 0) - COALESCE(SUM(s.Quantity), 0) AS BalanceQuantity
-- FROM Lots l
-- LEFT JOIN Purchaser p ON l.LotNumber = p.LotNumber
-- LEFT JOIN Seller s ON l.LotNumber = s.LotNumber
-- GROUP BY l.LotNumber;

DELIMITER $$

CREATE TRIGGER after_purchaser_insert_update_inventory
AFTER INSERT ON Purchaser
FOR EACH ROW
BEGIN
    INSERT INTO Inventory ( LotNumber, BalanceBales, BalanceQuantity)
    VALUES (
        NEW.LotNumber,
        NEW.NumberOfBales,
        NEW.Quantity
    )
    ON DUPLICATE KEY UPDATE
        BalanceBales = BalanceBales + NEW.NumberOfBales,
        BalanceQuantity = BalanceQuantity + NEW.Quantity;
END$$

DELIMITER ;

drop trigger if exists after_purchaser_insert_update;

-- 22/03
drop trigger if exists after_purchaser_insert_update_inventory;
drop trigger if exists after_seller_insert_update_inventory;

-- 22/03

show triggers;

-- DELIMITER $$
-- CREATE TRIGGER after_purchaser_insert_update
-- AFTER INSERT ON Purchaser
-- FOR EACH ROW
-- BEGIN
--     INSERT INTO Inventory (UserID, LotNumber, BalanceBales, BalanceQuantity)
--     VALUES (
--         NEW.UserID,
--         NEW.LotNumber,
--         NEW.NumberOfBales,
--         NEW.Quantity
--     )
--     ON DUPLICATE KEY UPDATE
--         BalanceBales = BalanceBales + NEW.NumberOfBales,
--         BalanceQuantity = BalanceQuantity + NEW.Quantity;
-- END$$

-- DELIMITER ;    --existing updated on 23/02/25

-- DELIMITER $$

-- CREATE TRIGGER after_seller_insert_update
-- AFTER INSERT ON Seller
-- FOR EACH ROW
-- BEGIN
--     UPDATE Inventory
--     SET 
--         BalanceBales = BalanceBales - NEW.NumberOfBales,
--         BalanceQuantity = BalanceQuantity - NEW.Quantity
--     WHERE 
--         LotNumber = NEW.LotNumber
--         AND UserID = NEW.UserID;
-- END$$

-- DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_seller_insert_update
AFTER INSERT ON Seller
FOR EACH ROW
BEGIN
    INSERT INTO Inventory ( LotNumber, BalanceBales, BalanceQuantity)
    VALUES (
                  -- UserID from the new seller record
        NEW.LotNumber,       -- LotNumber from the new seller record
        -NEW.NumberOfBales,  -- Deduct NumberOfBales in case of new insertion
        -NEW.Quantity        -- Deduct Quantity in case of new insertion
    )
    ON DUPLICATE KEY UPDATE
        BalanceBales = BalanceBales - NEW.NumberOfBales, -- Deduct NumberOfBales
        BalanceQuantity = BalanceQuantity - NEW.Quantity; -- Deduct Quantity
END$$

DELIMITER ;

drop trigger if exists after_seller_insert_update;

DELIMITER $$

CREATE TRIGGER after_seller_insert_update_inventory
AFTER INSERT ON Seller
FOR EACH ROW
BEGIN
    INSERT INTO Inventory ( LotNumber, BalanceBales, BalanceQuantity)
    VALUES (
    
        -NEW.LotNumber,       -- LotNumber from the new seller record
        -NEW.NumberOfBales,  -- Deduct NumberOfBales in case of new insertion
        -NEW.Quantity        -- Deduct Quantity in case of new insertion
    )
    ON DUPLICATE KEY UPDATE
        BalanceBales = BalanceBales - NEW.NumberOfBales, -- Deduct NumberOfBales
        BalanceQuantity = BalanceQuantity - NEW.Quantity; -- Deduct Quantity
END$$

DELIMITER ;

show triggers;


DROP TRIGGER IF EXISTS after_seller_insert_update;
CREATE INDEX idx_inventory_user_lot ON Inventory(UserID, LotNumber);

