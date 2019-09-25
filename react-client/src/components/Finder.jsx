import React, { Component } from 'react';
import { Typography, Input, Select } from 'antd';
import apiKey from '../../env/config.js'

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const select = (
  <Select defaultValue="title" style={{ width: 90 }}>
    <Option value="title">Title</Option>
    <Option value="author">Author</Option>
  </Select>
);

class Finder extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
        <Title level={2}>Search</Title>
        <Search addonBefore={select} placeholder="Find book" onSearch={value => console.log(value)} enterButton />
        <h4> Search Component </h4>
        There are 10 items.
      </div>
    );
  }
}

export default Finder;