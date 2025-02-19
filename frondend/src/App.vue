<script>
  import axios from 'axios';
  import { marked } from 'marked';

  export default {
    data() {
      return {
        articles: [],  // 存储所有文章
        selectedArticle: { title: '', content: '' },  // 当前选择的文章
        isCollapsed: false  // 控制导航栏是否收拢
      };
    },
    created() {
      axios.get('http://localhost:3000/articles')
        .then(response => {
          const promises = response.data.map(file => {
            return axios.get(`http://localhost:3000/${file}`)
              .then(res => {
                const content = res.data ? marked(res.data) : '';
                return {
                  title: file.replace('.md', ''),
                  content: content
                };
              });
          });

          Promise.all(promises)
            .then(articles => {
              this.articles = articles;
              if (articles.length > 0) {
                this.selectArticle(articles[0]);
              }
            });
        })
        .catch(error => {
          console.error("无法获取文章列表", error);
        });
    },
    methods: {
      selectArticle(article) {
        this.selectedArticle = article;
      },
      toggleSidebar() {
        this.isCollapsed = !this.isCollapsed;
      }
    }
  };
</script>

<template>
  <div class="blog-container">
    <div class="sidebar">
      <h2 style="text-align: center;" @click="toggleSidebar">
        <span class="toggle-symbol">{{ isCollapsed ? '▲' : '▼' }}</span>鼠国太医文章目录
      </h2>
      <ul v-if="!isCollapsed">
        <li v-for="article in articles" :key="article.title">
          <button @click="selectArticle(article)" :class="{'highlighted': article === selectedArticle}">
            {{ article.title }}
          </button>
        </li>
      </ul>
    </div>
    <div class="content">
      <h2 style="font-weight: bolder;">{{ selectedArticle.title }}</h2>
      <hr>
      <br>
      <div v-html="selectedArticle.content"></div>
    </div>
  </div>
</template>

<style>
.blog-container {
  display: flex;
  width: 100%;  /* 父容器宽度最大化 */
  height: 100vh;  /* 父容器高度占满屏幕 */
}

.sidebar {
  width: 250px;  /* 左侧导航栏固定宽度 */
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  flex-shrink: 0;  /* 防止缩小 */
  transition: all 0.3s ease; /* 添加动画 */
}

.sidebar h2 {
  font-size: 20px;
  margin-bottom: 10px;
  cursor: pointer;
}

.sidebar .toggle-symbol {
  margin-right: 10px;
  font-size: 18px;
  transition: transform 0.3s ease;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin: 10px 0;
}

.sidebar button {
  background: none;
  border: none;
  text-align: left;
  font-size: 16px;
  width: 100%;
  padding: 8px;
  cursor: pointer;
}

.sidebar button:hover {
  background-color: #ddd;
  border-radius: 4px;
}

.sidebar button.highlighted {
  background-color: #4CAF50;  /* 高亮背景色 */
  color: white;  /* 高亮时文字颜色 */
}

.content {
  width: 100%;  /* 右侧内容区域自适应宽度 */
  max-width: 1200px;  /* 设置最大宽度 */
  min-width: 800px;  /* 设置最小宽度 */
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  margin-left: 20px;  /* 给右侧内容添加左侧间距 */
}

.content h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.content div {
  font-size: 16px;
}
</style>
