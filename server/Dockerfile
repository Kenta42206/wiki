FROM golang:1.23.3-alpine3.20 as builder

ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_NAME=${DB_NAME}

WORKDIR /go/src
COPY . .

RUN go build main.go

CMD ["go", "run", "main.go"]

