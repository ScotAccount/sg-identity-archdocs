FROM ruby:3.0-alpine AS middleman-builder
WORKDIR /app
ENV RAILS_ENV production

RUN apk update && apk --update add ruby ruby-irb nodejs ruby-json ruby-rake \
   ruby-bigdecimal ruby-io-console libstdc++ tzdata  \
   libffi-dev libxml2-dev libxslt-dev

# Necessary for some gems which are compiled on bundle install
RUN apk add --virtual build-deps git build-base ruby-dev \
   libc-dev linux-headers && \
   gem install bundler && \
   bundle config build.nokogiri --use-system-libraries

# Copy app folder
COPY app/ /app

# Install Ruby gems
RUN bundle install

# Build the application
RUN bundle exec middleman build --verbose

# Copy the resulting code to the nginx container
FROM nginx:1.25.3-alpine
RUN rm -rf /usr/share/nginx/html
COPY --from=middleman-builder /app/build /usr/share/nginx/html