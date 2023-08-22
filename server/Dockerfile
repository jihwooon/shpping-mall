FROM node:18
RUN mkdir -p /var/app
WORKDIR /var/app
# 빌드 컨테스트에서 이미지로 파일들을 복사하는 데 사용된다.
COPY . .
RUN npm install
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000

# CMD 컨테이너가 시작되는 시점에 해당 설정이 실행된다.
CMD ["npm", "start"]
