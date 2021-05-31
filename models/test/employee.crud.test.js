const Employee = require('../employee.model');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

describe('Employee', () => {

  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getUri();

      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {

    before(async () => {
      const testEmpOne = new Employee({ firstName: 'Thomas', lastName: 'Anderson', department: 'IT' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Elliot', lastName: 'Alderson', department: 'IT' });
      await testEmpTwo.save();

      const testEmpThree = new Employee({ firstName: 'Emma', lastName: 'Cowell', department: 'Testing' });
      await testEmpThree.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 3;

      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const emp1 = await Employee.findOne({ firstName: 'Thomas' });
      const emp2 = await Employee.findOne({ lastName: 'Anderson' });
      const emp3 = await Employee.findOne({ department: 'IT' });

      const expectedFirstName = 'Thomas';
      const expectedLastName = 'Anderson';
      const expectedDepartment = 'IT';

      expect(emp1.firstName).to.be.equal(expectedFirstName);
      expect(emp2.lastName).to.be.equal(expectedLastName);
      expect(emp3.department).to.be.equal(expectedDepartment);
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'Elliot', lastName: 'Alderson', department: 'IT' });
      
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {
    
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Thomas', lastName: 'Anderson', department: 'IT' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Elliot', lastName: 'Alderson', department: 'IT' });
      await testEmpTwo.save();

      const testEmpThree = new Employee({ firstName: 'Emma', lastName: 'Cowell', department: 'Testing' });
      await testEmpThree.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'Elliot' }, { $set: { firstName: '=Elliot=' }});

      const updatedEmployee = await Employee.findOne({ firstName: '=Elliot=' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Elliot' });
      employee.firstName = '=Elliot='
      await employee.save();

      const updatedEmployee = await Employee.findOne({ firstName: '=Elliot=' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated!' }});
      const employees = await Employee.find();

      expect(employees.length).to.be.equal(3);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Removing data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Thomas', lastName: 'Anderson', department: 'IT' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Elliot', lastName: 'Alderson', department: 'IT' });
      await testEmpTwo.save();

      const testEmpThree = new Employee({ firstName: 'Emma', lastName: 'Cowell', department: 'Testing' });
      await testEmpThree.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Elliot' });
      const removeEmployee = await Employee.findOne({ firstName: 'Elliot' });

      expect(removeEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Thomas' });
      await employee.remove();

      const removedEmployee = await Employee.findOne({ firstName: 'Thomas' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();

      expect(employees.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
});