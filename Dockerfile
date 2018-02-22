FROM      node:9.5

WORKDIR   /usr/app

COPY      package.json .
RUN       npm i

COPY      src .

CMD       npm run dev
