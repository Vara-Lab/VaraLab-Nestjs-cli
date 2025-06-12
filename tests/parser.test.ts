import { parseIDL } from '../src/parser';

describe('parseIDL', () => {
  it('parses a simple IDL file', () => {
    const idl = \`
      service UserService {
        getUser(id: string)
        createUser(name: string, email: string)
      }
    \`;

    const result = parseIDL(idl);

    expect(result.services.length).toBe(1);
    expect(result.services[0].name).toBe('UserService');
    expect(result.services[0].methods.length).toBe(2);
    expect(result.services[0].methods[0]).toEqual({
      name: 'getUser',
      params: ['id: string'],
    });
  });
});