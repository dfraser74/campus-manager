import * as React from 'react';
import * as Backbone from 'backbone';
import { Table, Tr, Td, Th, Thead } from 'reactable';
import { Col, Row, Button, FormControl } from 'react-bootstrap';
const FontAwesome = require('react-fontawesome');
const CourseModalComponent = require('./CourseModalComponent.js');
const CourseModel = require('../models/CourseModel');
const TermsCollection = require('../collections/TermsCollection');
const moment = require('moment');

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      showModal: false,
      course: new CourseModel(),
      modalTitle: 'New Course',
      filterBy: ''
    };
  },

  close() {
    this.setState({ showModal: false });
  },

  open(e) {
    e.preventDefault();
    const course = this.getCollection().get(e.currentTarget.getAttribute('data-id')) || new CourseModel();
    this.state.course.set(course.attributes);
    this.setState({
      modalTitle: 'Edit Course',
      showModal: true
    });
  },

  show(e) {
    e.preventDefault();
    Backbone.history.navigate('courses/' + e.currentTarget.getAttribute('data-id'), true);
  },

  changeFilterValue(e) {
    this.setState({
      filterBy: e.currentTarget.value
    });
  },

  render() {
    const hidden = this.props.currentUser.roles().includes('admin') ? '' : 'hidden';

    const courseRows = this.getCollection().map(course => {
      return (
        <Tr key={course.id}>
          <Td column="Name" value={course.get('name')}>
            <div>
              <a href="#" onClick={this.show} data-id={course.id}>{course.get('name')}</a>
            </div>
          </Td>
          <Td column="Section">{course.get('section')}</Td>
          <Td column="Textbook">{course.get('textbook').get('name')}</Td>
          <Td column="Location">{course.get('location') ? course.get('location').get('name') : ''}</Td>
          <Td column="Term">{course.get('term').get('name')}</Td>
          <Td column="Days">{`${course.shortDays()} ${moment(course.get('timeStart'), 'HH:mm').format('h:mm a')} - ${moment(course.get('timeEnd'), 'HH:mm').format('h:mm a')}`}</Td>
          <Td column="Seats">{course.get('registrations').length + ' / ' + course.get('seats')}</Td>
          <Td column="Cost">{'$' + Number(course.get('cost')).toFixed(2)}</Td>
          <Td column="edit" className={hidden}>
            <a href="#" onClick={this.open} data-id={course.id}>
              <FontAwesome name='pencil' />
            </a>
          </Td>
        </Tr>
      );
    });

    return (
      <Row>
        <Col xs={12}>
          <h3>
            Courses
            <small>
              <a href="#" className={`${hidden} pull-right`} onClick={this.open} data-test="new-course">
                <FontAwesome name='plus' />
                &nbsp;Course
              </a>
            </small>
          </h3>
          <FormControl
            type="text"
            placeholder="Filter..."
            onChange={this.changeFilterValue}
            defaultValue={this.state.filterBy}
          />
          <br />
          <div className="x-scroll">
            <Table
              className="table table-condensed table-striped"
              itemsPerPage={20}
              filterable={['Name', 'Location', 'Term', 'Days', 'Seats', 'Cost', 'Textbook']}
              sortable={['Name', 'Location', 'Term', 'Days', 'Seats', 'Cost', 'Textbook']}
              filterBy={this.state.filterBy}
            >
              <Thead>
                <Th>Name</Th>
                <Th>Section</Th>
                <Th>Textbook</Th>
                <Th>Location</Th>
                <Th>Term</Th>
                <Th>Days</Th>
                <Th>Seats</Th>
                <Th>Cost</Th>
                <Th className={hidden}>edit</Th>
              </Thead>
              {courseRows}
            </Table>
          </div>
          <CourseModalComponent
            show={this.state.showModal}
            onHide={this.close}
            terms={this.props.terms}
            textbooks={this.props.textbooks}
            courses={this.getCollection()}
            model={this.state.course}
            locations={this.props.locations}
            title={this.state.modalTitle}
            listComponent={this}
          />
        </Col>
      </Row>
    );
  }
});
