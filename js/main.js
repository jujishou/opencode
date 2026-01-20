// OpenCode 深度教程 - 主JavaScript文件

// ===== 懒加载 Polyfill =====
// 为不支持 loading="lazy" 的浏览器提供兼容性
(function() {
  if ('loading' in HTMLImageElement.prototype) {
    // 浏览器原生支持懒加载，无需处理
    return;
  }

  // Polyfill: 使用 IntersectionObserver 实现懒加载
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.removeAttribute('loading');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    lazyImages.forEach(img => {
      if (img.src) {
        img.dataset.src = img.src;
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
      }
      imageObserver.observe(img);
    });
  } else {
    // 最终回退：直接加载所有图片
    lazyImages.forEach(img => {
      img.removeAttribute('loading');
    });
  }
})();

// ===== 下一页预加载 =====
// 当用户接近页面底部时，预加载下一页
function initNextPagePreload() {
  const nextLink = document.querySelector('.article-nav-item.next');
  if (!nextLink) return;

  const nextHref = nextLink.getAttribute('href');
  if (!nextHref) return;

  let preloaded = false;

  const preloadNextPage = () => {
    if (preloaded) return;

    // 检查用户是否滚动到页面底部 80%
    const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;

    if (scrollPercent > 0.8) {
      preloaded = true;

      // 创建预加载链接
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = nextHref;
      link.as = 'document';
      document.head.appendChild(link);

      // 移除滚动监听
      window.removeEventListener('scroll', preloadNextPage);
    }
  };

  // 使用节流函数优化滚动性能
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      preloadNextPage();
      scrollTimeout = null;
    }, 100);
  }, { passive: true });
}

// 获取链接前缀（根据当前页面位置）
function getLinkPrefix() {
  const path = window.location.pathname;
  // 如果当前在tutorial目录下，不需要前缀
  if (path.includes('/tutorial/')) {
    return '';
  }
  // 否则需要tutorial/前缀
  return 'tutorial/';
}

// 教程数据
const tutorialData = {
  chapters: [
    {
      title: '第一章：入门指南',
      sections: [
        { id: '1.1', title: '什么是OpenCode', file: '1.1-what-is-opencode.html' },
        { id: '1.2', title: '安装OpenCode', file: '1.2-installation.html' },
        { id: '1.3', title: '快速开始', file: '1.3-quickstart.html' },
        { id: '1.4', title: '终端要求', file: '1.4-terminal-requirements.html' }
      ]
    },
    {
      title: '第二章：基础配置',
      sections: [
        { id: '2.1', title: '配置文件详解', file: '2.1-config-file.html' },
        { id: '2.2', title: 'AI提供商配置', file: '2.2-providers.html' },
        { id: '2.3', title: '模型选择与配置', file: '2.3-models.html' },
        { id: '2.4', title: '环境变量设置', file: '2.4-environment.html' }
      ]
    },
    {
      title: '第三章：界面操作',
      sections: [
        { id: '3.1', title: 'TUI终端界面', file: '3.1-tui.html' },
        { id: '3.2', title: 'CLI命令行接口', file: '3.2-cli.html' },
        { id: '3.3', title: 'Web界面', file: '3.3-web.html' },
        { id: '3.4', title: 'IDE集成', file: '3.4-ide.html' }
      ]
    },
    {
      title: '第四章：核心功能',
      sections: [
        { id: '4.1', title: '内置工具详解', file: '4.1-tools.html' },
        { id: '4.2', title: '斜杠命令', file: '4.2-commands.html' },
        { id: '4.3', title: '快捷键参考', file: '4.3-keybinds.html' },
        { id: '4.4', title: '文件引用与搜索', file: '4.4-file-reference.html' }
      ]
    },
    {
      title: '第五章：高级配置',
      sections: [
        { id: '5.1', title: 'Agents代理系统', file: '5.1-agents.html' },
        { id: '5.2', title: 'Rules规则配置', file: '5.2-rules.html' },
        { id: '5.3', title: '主题配置', file: '5.3-themes.html' },
        { id: '5.4', title: '权限系统', file: '5.4-permissions.html' }
      ]
    },
    {
      title: '第六章：扩展功能',
      sections: [
        { id: '6.1', title: 'LSP语言服务器', file: '6.1-lsp.html' },
        { id: '6.2', title: '代码格式化器', file: '6.2-formatters.html' },
        { id: '6.3', title: '自定义命令', file: '6.3-custom-commands.html' },
        { id: '6.4', title: 'MCP协议服务器', file: '6.4-mcp.html' }
      ]
    },
    {
      title: '第七章：开发与集成',
      sections: [
        { id: '7.1', title: 'SDK使用指南', file: '7.1-sdk.html' },
        { id: '7.2', title: '网络配置', file: '7.2-network.html' },
        { id: '7.3', title: '企业版功能', file: '7.3-enterprise.html' },
        { id: '7.4', title: '故障排除', file: '7.4-troubleshooting.html' }
      ]
    }
  ]
};

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initSidebar();
  initSearch();
  initCodeCopy();
  initBackToTop();
  initTOC();
  initMobileMenu();
  highlightCurrentPage();
  initNextPagePreload();
});

// 主题初始化
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.classList.toggle('light-mode', savedTheme === 'light');
  updateThemeIcon(savedTheme);

  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

// 切换主题
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  const theme = isLight ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
  updateThemeIcon(theme);
}

// 更新主题图标
function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-toggle svg');
  if (icon) {
    if (theme === 'light') {
      icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
    } else {
      icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
    }
  }
}

// 初始化侧边栏
function initSidebar() {
  const sidebarContainer = document.querySelector('.sidebar-content');
  if (!sidebarContainer) return;

  let html = '';
  tutorialData.chapters.forEach((chapter, chapterIndex) => {
    html += `
      <div class="sidebar-section">
        <div class="sidebar-title">${chapter.title}</div>
        <ul class="sidebar-nav">
    `;
    chapter.sections.forEach(section => {
      html += `
        <li>
          <a href="${getLinkPrefix()}${section.file}" data-section="${section.id}">
            <span class="chapter-number">${section.id}</span>
            ${section.title}
          </a>
        </li>
      `;
    });
    html += `
        </ul>
      </div>
    `;
  });

  sidebarContainer.innerHTML = html;
}

// 初始化搜索功能
function initSearch() {
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');

  if (!searchInput || !searchResults) return;

  let searchTimeout;

  searchInput.addEventListener('input', function(e) {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim().toLowerCase();

    if (query.length < 2) {
      searchResults.classList.remove('active');
      return;
    }

    searchTimeout = setTimeout(() => {
      const results = searchTutorials(query);
      displaySearchResults(results, searchResults);
    }, 200);
  });

  searchInput.addEventListener('focus', function() {
    if (this.value.length >= 2) {
      searchResults.classList.add('active');
    }
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-box')) {
      searchResults.classList.remove('active');
    }
  });
}

// 搜索教程
function searchTutorials(query) {
  const results = [];

  tutorialData.chapters.forEach(chapter => {
    chapter.sections.forEach(section => {
      const titleMatch = section.title.toLowerCase().includes(query);
      const idMatch = section.id.toLowerCase().includes(query);

      if (titleMatch || idMatch) {
        results.push({
          title: `${section.id} ${section.title}`,
          chapter: chapter.title,
          file: section.file
        });
      }
    });
  });

  return results;
}

// 显示搜索结果
function displaySearchResults(results, container) {
  if (results.length === 0) {
    container.innerHTML = '<div class="search-result-item"><div class="search-result-title">未找到结果</div></div>';
  } else {
    container.innerHTML = results.map(result => `
      <a href="${getLinkPrefix()}${result.file}" class="search-result-item">
        <div class="search-result-title">${result.title}</div>
        <div class="search-result-excerpt">${result.chapter}</div>
      </a>
    `).join('');
  }
  container.classList.add('active');
}

// 初始化代码复制功能
function initCodeCopy() {
  document.querySelectorAll('pre').forEach(pre => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = '复制';
    copyBtn.addEventListener('click', async () => {
      const code = pre.querySelector('code').textContent;
      try {
        await navigator.clipboard.writeText(code);
        copyBtn.textContent = '已复制!';
        setTimeout(() => {
          copyBtn.textContent = '复制';
        }, 2000);
      } catch (err) {
        copyBtn.textContent = '失败';
        setTimeout(() => {
          copyBtn.textContent = '复制';
        }, 2000);
      }
    });
    wrapper.appendChild(copyBtn);
  });
}

// 初始化回到顶部按钮
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 初始化目录导航
function initTOC() {
  const toc = document.querySelector('.toc-list');
  const content = document.querySelector('.article-content');

  if (!toc || !content) return;

  const headings = content.querySelectorAll('h2, h3');

  if (headings.length === 0) {
    const tocContainer = document.querySelector('.toc');
    if (tocContainer) tocContainer.style.display = 'none';
    return;
  }

  let tocHtml = '';
  headings.forEach((heading, index) => {
    const id = `heading-${index}`;
    heading.id = id;
    const indent = heading.tagName === 'H3' ? 'style="padding-left: 32px;"' : '';
    tocHtml += `<li><a href="#${id}" ${indent}>${heading.textContent}</a></li>`;
  });

  toc.innerHTML = tocHtml;

  // 滚动高亮
  const tocLinks = toc.querySelectorAll('a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(link => link.classList.remove('active'));
        const activeLink = toc.querySelector(`a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-100px 0px -80% 0px' });

  headings.forEach(heading => observer.observe(heading));
}

// 初始化移动端菜单
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');

  if (!menuBtn || !sidebar) return;

  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });

  // 点击内容区域关闭菜单
  document.querySelector('.main-content')?.addEventListener('click', () => {
    sidebar.classList.remove('active');
  });
}

// 高亮当前页面
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.sidebar-nav a');

  links.forEach(link => {
    if (currentPath.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });
}

// 生成章节列表（首页用）
function generateChapterList() {
  const container = document.getElementById('chapter-list');
  if (!container) return;

  let html = '';
  tutorialData.chapters.forEach(chapter => {
    html += `
      <div class="chapter-group">
        <h3 class="chapter-group-title">${chapter.title}</h3>
        <ul class="chapter-items">
    `;
    chapter.sections.forEach(section => {
      html += `
        <li class="chapter-item">
          <a href="${getLinkPrefix()}${section.file}">
            <span class="num">${section.id}</span>
            <span>${section.title}</span>
          </a>
        </li>
      `;
    });
    html += `
        </ul>
      </div>
    `;
  });

  container.innerHTML = html;
}

// 页面导航（上一篇/下一篇）
function initPageNavigation() {
  const currentPath = window.location.pathname;
  const allSections = [];

  tutorialData.chapters.forEach(chapter => {
    chapter.sections.forEach(section => {
      allSections.push(section);
    });
  });

  const currentIndex = allSections.findIndex(s => currentPath.includes(s.file));
  const navContainer = document.querySelector('.article-nav');

  if (!navContainer || currentIndex === -1) return;

  let navHtml = '';

  if (currentIndex > 0) {
    const prev = allSections[currentIndex - 1];
    navHtml += `
      <a href="${prev.file}" class="article-nav-item prev">
        <div class="article-nav-label">← 上一篇</div>
        <div class="article-nav-title">${prev.id} ${prev.title}</div>
      </a>
    `;
  } else {
    navHtml += '<div class="article-nav-item prev" style="visibility: hidden;"></div>';
  }

  if (currentIndex < allSections.length - 1) {
    const next = allSections[currentIndex + 1];
    navHtml += `
      <a href="${next.file}" class="article-nav-item next">
        <div class="article-nav-label">下一篇 →</div>
        <div class="article-nav-title">${next.id} ${next.title}</div>
      </a>
    `;
  } else {
    navHtml += '<div class="article-nav-item next" style="visibility: hidden;"></div>';
  }

  navContainer.innerHTML = navHtml;
}

// 代码高亮（简单实现）
function highlightCode() {
  document.querySelectorAll('pre code').forEach(block => {
    // 高亮关键字
    let html = block.innerHTML;

    // JSON/JavaScript 关键字
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'true', 'false', 'null', 'undefined', 'import', 'export', 'from', 'async', 'await'];
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      html = html.replace(regex, `<span class="hljs-keyword">${keyword}</span>`);
    });

    // 字符串
    html = html.replace(/"([^"\\]|\\.)*"/g, '<span class="hljs-string">$&</span>');
    html = html.replace(/'([^'\\]|\\.)*'/g, '<span class="hljs-string">$&</span>');

    // 数字
    html = html.replace(/\b(\d+)\b/g, '<span class="hljs-number">$1</span>');

    // 注释
    html = html.replace(/\/\/.*$/gm, '<span class="hljs-comment">$&</span>');
    html = html.replace(/\/\*[\s\S]*?\*\//g, '<span class="hljs-comment">$&</span>');

    block.innerHTML = html;
  });
}

// 平滑滚动到锚点
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute('href').slice(1);
  const target = document.getElementById(targetId);

  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, null, `#${targetId}`);
  }
});

// 初始化页面
if (document.getElementById('chapter-list')) {
  generateChapterList();
}

// 页面导航初始化
window.addEventListener('load', () => {
  initPageNavigation();
  highlightCode();
});
