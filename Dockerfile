#设置基础镜像
From nginx

#将dist文件夹的内容复制到/usr/share/nginx/html/ 这个目录下面
COPY ["packages/admin/dist/","/usr/share/nginx/html/ "]
