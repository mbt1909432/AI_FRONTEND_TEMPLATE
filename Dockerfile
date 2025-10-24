# Stage 1: Build the React app
FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# 复制构建产物到 Nginx
COPY --from=build /app/build /usr/share/nginx/html

# 复制 Nginx 配置（可选，使用默认配置）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]

