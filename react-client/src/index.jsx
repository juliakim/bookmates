import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Finder from './components/Finder.jsx';
import 'antd/dist/antd.css';
import { PageHeader, Menu, Icon, Layout, Typography } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

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
        <Layout>
          <Content style={{ padding: '50px 50px 0 50px' }}>
              {this.state.current === 'home' ? (
                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                  <Title level={2}>Bookshelf</Title>
                  <Title level={2}>Favorites</Title>
                  <Title level={2}>Wishlist</Title>
                </div>
              ) : (
                <Finder />
              )}
          </Content>
          <Footer>Bookmates</Footer>
        </Layout>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));