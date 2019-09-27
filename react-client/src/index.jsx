import React from 'react';
import ReactDOM from 'react-dom';
import Finder from './components/Finder.jsx';
import Bookshelf from './components/Bookshelf.jsx';
import Favorites from './components/Favorites.jsx';
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
      bookshelf: [],
      favorites: []
    }
    this.getBookshelf = this.getBookshelf.bind(this);
    this.getFavorites = this.getFavorites.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
    this.removeFromBookshelf = this.removeFromBookshelf.bind(this);
    this.removeFromFavorites = this.removeFromFavorites.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getBookshelf();
    this.getFavorites();
  }

  getBookshelf() {
    axios.get('/books')
      .then(({ data }) => this.setState({bookshelf: data}))
      .catch(error => console.log(error));
  }

  getFavorites() {
    axios.get('/favorites')
      .then(({ data }) => this.setState({favorites: data}))
      .catch(error => console.log(error));
  }

  addToFavorites(e) {
    let { title, authors, publishedDate, description, pageCount, categories, imageLinks, previewLink, isbn } = e;
    axios.post('/favorites', {
      title: title,
      authors: authors,
      publishedDate: publishedDate,
      description: description,
      pageCount: pageCount,
      imageLinks: imageLinks,
      previewLink: previewLink,
      ISBN13: isbn
    })
      .then(() => {
        this.getFavorites();
      })
      .catch(error => 'Could not add book to favorites'); // add alertt
  }

  removeFromBookshelf(e) {
    axios.delete('/books', {
      data: {
        id: e.id
      }
    })
      .then(() => {
        this.getBookshelf();
        this.getFavorites();
      })
      .catch(error => console.log(error));
  }

  removeFromFavorites(e) {
    axios.delete('/favorites', {
      data: {
        id: e.id
      }
    })
      .then(() => {
        this.getBookshelf();
        this.getFavorites();
      })
      .catch(error => console.log(error));
  }

  handleClick(e) {
    this.setState({
      current: e.key,
    });
  }

  render () {
    return (
      <div>
        <PageHeader title="Bookmates" subTitle="Connect with other readers" />
        <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
          <Menu.Item key="home">
            <Icon type="home" />
            Home
          </Menu.Item>
          <Menu.Item key="favorites">
            <Icon type="star" />
            Favorites
          </Menu.Item>
          <Menu.Item key="search">
            <Icon type="search" />
            Find Books
          </Menu.Item>
          <Menu.Item key="discuss">
            <Icon type="read" />
            Discuss
          </Menu.Item>
        </Menu>
        <Layout>
          <Content style={{ padding: '50px 50px 0 50px' }}>
            {this.state.current === 'home' && <Bookshelf bookshelf={this.state.bookshelf} addToFavorites={this.addToFavorites} removeFromBookshelf={this.removeFromBookshelf} />}
            {this.state.current === 'favorites' && <Favorites favorites={this.state.favorites} removeFromFavorites={this.removeFromFavorites} />}
            {this.state.current === 'search' && <Finder current={this.state.current} updateBookshelf={this.getBookshelf} updateFavorites={this.getFavorites} />}
            {this.state.current === 'discuss' && <div>Coming Soon</div>}
          </Content>
          <Footer>Bookmates</Footer>
        </Layout>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));