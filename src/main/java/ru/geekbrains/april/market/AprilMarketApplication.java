package ru.geekbrains.april.market;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource("classpath:app.properties")
public class AprilMarketApplication {
    // План на курс:
    // 1. + Добавлять фото
    // 3. Склад
    // 4. + Добавить платежную систему
    // 5. + Загрузка товаров из файла
    // 6. + Регистрация пользователей
    // 8. Рубрикатор товаров
    // 9. Комментарии клиентов к товарам (возможно рейтинг)
    // 11. +++ При оформлении заказа нужно указать доп информацию: телефон, адрес доставки
    // 12. Промокоды
    // *. *** Интеграция с 1С
    // *. *** Админка

    /*
        Домашнее задание:
        1. Отдельная страница для просмотра информации о товаре
        2. Комментарии клиентов к товарам
        3. * Комментарии пользователь может оставлять только если он покупал этот товар
     */

    // todo Добавить на фронт обработку фронта на каждой странице
    // todo isUserLoggedIn -> global scope
    // todo в индекс.хтмл добавить товаров в корзине(10)

    public static void main(String[] args) {
        SpringApplication.run(AprilMarketApplication.class, args);
    }
}
