import Title from 'antd/lib/typography/Title'
import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Table, Space, Button, Form, Input, InputNumber, Modal } from 'antd'
import NavBreadcrumb from '../../../components/Navigation/NavBreadcrumb/NavBreadcrumb'

import axios from '../../../axios-instance'

const { Column, ColumnGroup } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default class Courses extends Component {
  state = {
    courses: [],
    subjects: [],
    lecturers: [],
    showForm: false,
    confirmLoading: false,
  }

  componentDidMount() {
    axios.get('/admin/courses')
      .then(res => this.setState({ 
        courses: res.data.courses,
        subjects: res.data.subjects,
        lecturers: res.data.lecturers 
      }))
      .then(res => console.log(this.state))
      .catch(err => this.props.onError(err));
  }

  toggleForm = () => this.setState({ showForm: !this.state.showForm })

  createCourseHandler = (values) => {
    console.log(values)
    axios.post('/admin/course', values, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
      .then(res => {
        console.log(res)
        if (res.status === 201) {
          this.setState({
            showForm: false,
            courses: [...this.state.courses, res.data.course]
          });
        }
      })
      .catch(err => this.props.onError(err));
  }

  deleteCourseHandler = (courseId) => {
    console.log(courseId)
    axios.delete('/admin/course/' + courseId)
      .then(res => {
        console.log(res)
        if (res.status === 200)
          this.setState({ courses: this.state.courses.filter(course => course._id !== courseId) });
      })
      .catch(err => this.props.onError(err));
  }

  render() {
    const { courses, showForm, confirmLoading } = this.state;

    const table = (
      <Table dataSource={courses} rowKey='_id'>
        <Column
          title='Subject ID'
          key='subjectId'
          dataIndex='subjectId.id'
        />
        <Column
          title='Subject Name'
          key='subjectName'
          dataIndex='subjectId.name'
        />
        <Column
          title='Lecturer Name'
          key='lecturerName'
          dataIndex='lecturerId.name'
        />
        <Column
          title='Class Type'
          key='classType'
          dataIndex='classType'
        />
        <Column
          title='Room'
          key='room'
          dataIndex='room'
        />
        <Column
          title='Weekday'
          key='weekday'
          dataIndex='weekday'
        />
        <Column
          title='Periods'
          key='periods'
          render={(text, record) => (
            <p>{record.periods[0] + '-' + record.periods[-1]}</p>
          )}
        />
        <Column
          title='Action'
          key='action'
          render={(text, record) => (
            <Space size='middle'>
              <Button onClick={() => this.deleteCourseHandler(record._id)} danger type='link'>Delete</Button>
            </Space>
          )}
        />
      </Table>
    );

    const form = (
      <Modal
        title={'Create New Course'}
        visible={showForm}
        confirmLoading={confirmLoading}
        onCancel={this.toggleForm}
        footer={[]}
      >
        <Form
          {...layout}
          id={'courseForm'}
          onFinish={this.createCourseHandler}
          onFinishFailed={null}
        >
          <Form.Item>

          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type='primary'
              htmlType='submit'
            >Submit</Button>
            {/* <Button
                htmlType='reset'
              >Reset</Button> */}
            <Button
              type='link'
              onClick={this.toggleForm}
            >Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    );

    return (
      <Fragment>
        <NavBreadcrumb
          elements={[
            { key: 1, text: 'Admin', to: '/' },
            { key: 2, text: 'Courses' },
          ]}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={3}>Course List</Title>
          <Button type='primary' onClick={this.toggleForm}>Add new course</Button>
        </div>
        {table}
        {form}
      </Fragment>
    )
  };
};
