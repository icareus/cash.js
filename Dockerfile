FROM      node:9.5

WORKDIR   /usr/app

COPY      package.json package-lock.json ./
RUN       npm i

COPY      . .

CMD       npm run dev
