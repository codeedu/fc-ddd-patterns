# DDD

## Aggregates

- **Customer**: Customer, Address
- **Checkout**: Order, OrderItem
- **Product**: Product

- Order with CustomerId: different aggregates
- OrderItem inside Order object: same aggregate
- ProductId: different aggregates

## Jest

### WORKSPACE Settings

Define an alternative Jest command used by Jest decorators at Vscode.

```
Jestrunner: **Jest Command**
npm test

```

This is safer but increases test delay to call compilation check before Jest.

```
npm run tsc -- --noEmit && jest
```
