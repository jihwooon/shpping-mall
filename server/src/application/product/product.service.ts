import { Injectable } from "@nestjs/common";
import Product from "./product.entity";
import ProductRepository from './product.repository'

@Injectable()
export class ProductService {

    constructor(private readonly productRepository: ProductRepository) {}
    
    CreateProduct(product: Product) {
        this.productRepository.save(product)
    }

    getProduct(id: number) {
        this.productRepository.findById(id)
    }

    getProducts() {
        const findAll = this.productRepository.findAll;
        return findAll
    }
    
}
