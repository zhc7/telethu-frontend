# First stage, build the frontend
FROM node:20-alpine

RUN yarn config set registry https://registry.npm.taobao.org/

ENV FRONTEND=/opt/frontend

WORKDIR $FRONTEND

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

COPY . .
RUN yarn build

# Second stage
FROM nginx:1.25.3

ENV HOME=/opt/app

WORKDIR $HOME

# Copy frontend from the first stage
COPY --from=0 /opt/frontend/dist dist
COPY nginx/ nginx/

RUN rm -r /etc/nginx/conf.d \
 && ln -s $HOME/nginx /etc/nginx/conf.d

RUN ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80
