FROM postgres:15

# 必要パッケージのインストール
# 全文検索にはpgroongaを使用する
RUN apt update && apt upgrade -y && \
    apt install -y -V ca-certificates lsb-release wget && \
    wget https://apache.jfrog.io/artifactory/arrow/$(lsb_release --id --short | tr 'A-Z' 'a-z')/apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb && \
    apt install -y -V ./apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb && \
    wget https://packages.groonga.org/debian/groonga-apt-source-latest-$(lsb_release --codename --short).deb && \
    apt install -y -V ./groonga-apt-source-latest-$(lsb_release --codename --short).deb && \
    apt update && \
    echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release --codename --short)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list && \
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - && \
    apt update && \
    apt install -y -V postgresql-15-pgdg-pgroonga && \
    rm -f ./apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb ./groonga-apt-source-latest-$(lsb_release --codename --short).deb && \
    apt clean && rm -rf /var/lib/apt/lists/*

COPY schema.sql /docker-entrypoint-initdb.d/
RUN chmod 0755 /docker-entrypoint-initdb.d/schema.sql