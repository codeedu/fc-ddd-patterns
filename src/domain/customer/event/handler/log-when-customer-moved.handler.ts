import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class LogWhenCustomerMovedHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    console.log(
      `[${event.dataTimeOccurred.toTimeString()}] CustomerMoved:\n`,
      `id: ${event.eventData.id}\n`,
      `name: ${event.eventData.name}\n`,
      `address: ${event.eventData.address}`,
    );
  }
}
