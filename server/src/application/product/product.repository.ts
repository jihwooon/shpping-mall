import { doQuery } from './db'
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import Product, { ProductListItem }  from './product.entity';

export default class productRepository {
    
    async save (product: Product): Promise<void> {
        await doQuery((connection) => connection.execute(`INSERT INTO product (productId, content, created, modified) VALUES (?,?,?, NULL)`, 
        [product.categoryId]))
    }
    
    async findById(id:number): Promise<Product | null> {
        const [rows] = await doQuery((connect) => connect.execute<RowDataPacket[]>(`SELECT * FROM product WHERE productId = ?`, [id]));
    
        const [row] = rows ?? [];
    
        if (!row) {
            return null;
        }
    
        return {
            productId: row['productId'],
            categoryId: row['categoryId'],
            productName: row['productName'],
            size: row['size'],
            recentPrice: row['recentPrice'],
            buyPrice: row['buyPrice'],
            sellPrice: row['sellPrice'],
            productInfo: row['productInfo'],
            imageUrl: row['imageUrl'],
        }
    }

    async findAll(): Promise<ProductListItem[]> {
        const [rows] = await doQuery((connect) => connect.execute<RowDataPacket[]>(`SELECT * FROM product`, []));
        
        return [rows ?? []].map((row) => ({
            productId: row['productId'],
            categoryId: row['categoryId'],
            productName: row['productName'],
            size: row['size'],
            recentPrice: row['recentPrice'],
            buyPrice: row['buyPrice'],
            sellPrice: row['sellPrice'],
            productInfo: row['productInfo'],
            imageUrl: row['imageUrl'],
        }))
    }

    async update(product:Product): Promise<boolean> {
        const [rows] = await doQuery((connect) => connect.execute<ResultSetHeader>(`UPDATE product SET productName = ?`, [product.productName]))

        return rows.affectedRows === 1
    }
    
    async deleteById(id: number): Promise<void> {
        await doQuery((connect) => connect.execute(`DELETE FROM product WHERE productId = ?`, [id]))
    }
        
}
