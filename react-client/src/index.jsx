import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';
import 'antd/dist/antd.css';
import { PageHeader, Menu, Icon } from 'antd';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'home',
      items: []
    }
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/items',
      success: (data) => {
        this.setState({
          items: data
        })
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  handleClick(e) {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }

  render () {
    return (
      <div>
        <PageHeader title="Bookmates" subTitle="A platform to connect with other readers" />
        <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
          <Menu.Item key="home">
            <Icon type="home" />
            Home
          </Menu.Item>
          <Menu.Item key="search">
            <Icon type="search" />
            Find Books
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));