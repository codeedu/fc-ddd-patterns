import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import { setupSequelize } from "../../../testing/helpers/db";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {

  const sequelize = setupSequelize({
    models: [
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]
  });

  let customer: Customer;
  let address: Address;
  let customerRepository: CustomerRepository;
  let productRepository: ProductRepository;
  let product: Product;
  let product2: Product;
  let orderItem: OrderItem;
  let orderItem2: OrderItem;

  beforeEach(async () => {
    customerRepository = new CustomerRepository();
    customer = new Customer("123", "Customer 1");
    address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    productRepository = new ProductRepository();
    product = new Product("111", "Product 1", 10);
    product2 = new Product("222", "Product 2", 15);
    await productRepository.create(product);
    await productRepository.create(product2);

    orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      4
    );
  });

  it("should create a new order", async () => {
    const order = new Order("9876", customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });
    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          product_id: product.id,
        },
      ],
    });
  });
  
  it("should update an order adding more items", async () => {
    let order = new Order("9876", customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const newOrder = order.addItems([orderItem2]);
    await orderRepository.update(newOrder);
    expect(order.id).toBe(newOrder.id);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });
    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: newOrder.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          product_id: product.id,
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: order.id,
          product_id: product2.id,
        },
      ],
    });
  });

});
