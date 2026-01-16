import ControllerNode from './ControllerNode';
import CommandNode from './CommandNode';
import QueryNode from './QueryNode';
import EventNode from './EventNode';
import HandlerNode from './HandlerNode';

export { ControllerNode, CommandNode, QueryNode, EventNode, HandlerNode };

export const nodeTypes = {
  controllerNode: ControllerNode,
  commandNode: CommandNode,
  queryNode: QueryNode,
  eventNode: EventNode,
  handlerNode: HandlerNode,
};
