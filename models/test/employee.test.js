const Employee = require('../employee.model.js');

const expect = require('chai').expect;

describe('Employee', () => {
  it("should throw an error if no arg", () => {
    const emp = new Employee({});

    emp.validate((err) => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if data are not a string', () => {
    const [string, func, array, object] = ['loremIpsum', function () {}, [], {} ];
    const testEmp1 = new Employee({firstName: string, lastName: array, department: string});
    const testEmp2 = new Employee({firstName: object, lastName: string, department: string});
    const testEmp3 = new Employee({firstName: string, lastName: array, department: func});
    const testEmp4 = new Employee({firstName: object, lastName: func, department: array});
    const testEmp5 = new Employee({firstName: func, lastName: array, department: object});

    const cases = [testEmp1, testEmp2, testEmp3, testEmp4, testEmp5];

    for (let testDep of cases) {
      testDep.validate(err => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should not throw an error if data are okay', () => {
    const [firstName, lastName, department] = ['Emma', 'Cowell', 'Testing'];
    const emp = new Employee({ firstName: firstName, lastName: lastName, department: department });

    emp.validate(err => {
      expect(err).to.not.exist;
    });
  })

});