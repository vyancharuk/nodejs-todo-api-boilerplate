import { todoServerController } from '../serverControllers';

describe('Todos Server', () => {

  it('Should correctly update expired todos', async () => {
 
    const result = await todoServerController.updateExpiredTodos({});

    expect(result).not.toEqual([]);
  });
});
