import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await this._getOrder(entity.id);
    await OrderModel
      .update(
        {
          customer_id: entity.customerId,
          total: entity.total(),
        },
        {
          where: { id: entity.id },
          fields: ['customer_id', 'total']
        })
      .then(async () => {
        await Promise.all(
          entity.items.map(async (item) => {
            await OrderItemModel.findByPk(item.id)
              .then(async (item) => {
                await OrderItemModel.update(
                  {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    name: item.name,
                    price: item.price
                  },
                  {
                    where: { id: item.id }
                  });
              })
              .catch(async () => {
                await OrderItemModel.create({
                  order_id: entity.id,
                  id: item.id,
                  product_id: item.productId,
                  quantity: item.quantity,
                  name: item.name,
                  price: item.price
                })
              });
          })
        );
      });
  }

  async find(id: string): Promise<Order> {
    await this._getOrder(id);
    const orderModel = await OrderModel.findOne({
      where: {
        id,
      },
      include: [OrderItemModel],
    });

    const orderItems = orderModel.items.map((item) => {
      return new OrderItem(
        item.id,
        item.name,
        item.price / item.quantity,
        item.product_id,
        item.quantity)
    });

    return new Order(
      orderModel.id,
      orderModel.customer_id,
      orderItems
    );
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [OrderItemModel]
    });
    const orders = orderModels.map((orderModel) => {
      const orderItems = orderModel.items.map((item) => {
        return new OrderItem(
          item.id,
          item.name,
          item.price / item.quantity,
          item.product_id,
          item.quantity)
      });
      return new Order(orderModel.id, orderModel.customer_id, orderItems);
    });
    return orders;
  }

  private async _getOrder(id: string): Promise<OrderModel> {
    return OrderModel.findByPk(id, {
      rejectOnEmpty: new Error(`Order not found with ID ${id}`)
    });
  }

  // private async _getItem(id: string): Promise<OrderItemModel> {
  //   return OrderItemModel.findByPk(id, {
  //     rejectOnEmpty: new Error(`OrderItem not found with ID ${id}`)
  //   });
  // }

}
