import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import CustomerMovedEvent from "./customer-moved.event";
import LogWhenCustomerMovedHandler from "./handler/log-when-customer-moved.handler";
import Log1WhenCustomerIsCreatedHandler from "./handler/log1-when-customer-is-created.handler";
import Log2WhenCustomerIsCreatedHandler from "./handler/log2-when-customer-is-created.handler";

describe("Customer events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new Log1WhenCustomerIsCreatedHandler();
    const eventHandler2 = new Log2WhenCustomerIsCreatedHandler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);    
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(2);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new Log1WhenCustomerIsCreatedHandler();
    const eventHandler2 = new Log2WhenCustomerIsCreatedHandler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);    
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    eventDispatcher.unregister("CustomerCreatedEvent", eventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(1);

    eventDispatcher.unregister("CustomerCreatedEvent", eventHandler2);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(0);
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new Log1WhenCustomerIsCreatedHandler();
    const eventHandler2 = new Log2WhenCustomerIsCreatedHandler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);    
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify customer created event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new Log1WhenCustomerIsCreatedHandler();
    const eventHandler2 = new Log2WhenCustomerIsCreatedHandler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);    
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);

    // To be added to constructor when eventDispatcher is global
    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "1",
      name: "Customer 1",
      address: "Street 1, 123 - 13330-250 - São Paulo",
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

  it("should notify customer moved event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new LogWhenCustomerMovedHandler();

    eventDispatcher.register("CustomerMovedEvent", eventHandler);
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    // To be added to changeAddress when eventDispatcher is global
    const customerMovedEvent = new CustomerMovedEvent({
      id: "1",
      name: "Customer 1",
      address: "Street 1, 123 - 13330-250 - São Paulo",
    });

    eventDispatcher.notify(customerMovedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

});
