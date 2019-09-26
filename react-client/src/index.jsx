import React from 'react';
import ReactDOM from 'react-dom';
import Finder from './components/Finder.jsx';
import Bookshelf from './components/Bookshelf.jsx';
import 'antd/dist/antd.css';
import { PageHeader, Menu, Icon, Layout, Typography } from 'antd';
import axios from 'axios';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'home',
      bookshelf: []
    }
    this.getBookshelf = this.getBookshelf.bind(this);
    this.removeFromBookshelf = this.removeFromBookshelf.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getBookshelf();
  }

  componentDidUpdate() {
    this.getBookshelf();
  }

  getBookshelf() {
    axios.get('/books')
      .then(({ data }) => this.setState({bookshelf: data}))
      .catch(error => console.log(error));
  }

  removeFromBookshelf(e) {
    axios.delete('/books', {
      data: {
        id: e.id
      }
    })
      .then(({data}) => console.log(data))
      .catch(error => console.log(error));
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
                <div style={{ background: '#fff', padding: 24, minHeight: 400 }}>
                  <Title level={2}>Bookshelf</Title>
                    <Bookshelf bookshelf={this.state.bookshelf} removeFromBookshelf={this.removeFromBookshelf}/>
                  <Title level={2}>Favorites</Title>
                  <Title level={2}>Wishlist</Title>
                </div>
              ) : (
                <Finder current={this.state.current}/>
              )}
          </Content>
          <Footer>Bookmates</Footer>
        </Layout>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));