FROM golang:1.23.3-alpine3.20 as builder

ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_NAME=wiki

WORKDIR /go/src
COPY . .

RUN go build main.go

