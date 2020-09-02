window.onload = function () {
    var _quantity, _price, orderitem_num, delta_quantity, orderitem_quantity, delta_cost;
    var quantity_arr = [];
    var price_arr = [];

    var TOTAL_FORMS = parseInt($('input[name="orderitems-TOTAL_FORMS"]').val());
    var order_total_quantity = parseInt($('.order_total_quantity').text()) || 0;
    var order_total_cost = parseFloat($('.order_total_cost').text().replace(',', '.')) || 0;

    for (var i=0; i < TOTAL_FORMS; i++) {
        _quantity = parseInt($('input[name="orderitems-' + i + '-quantity"]').val());
        _price = parseFloat($('.orderitems-' + i + '-price').text().replace(',', '.'));
        if (_quantity >= 0){
            quantity_arr[i] = _quantity;
        } else {
            quantity_arr[i] = 0;
        }
        if (_price){
            price_arr[i] = _price;
        } else {
            price_arr[i] = 0;
        }
    }

    if (!order_total_quantity) {
        for (var i=0; i < TOTAL_FORMS; i++) {
            order_total_quantity += quantity_arr[i];
            order_total_cost += quantity_arr[i] * price_arr[i];
        }
        $('.order_total_quantity').html(order_total_quantity.toString());
        $('.order_total_cost').html(Number(order_total_cost.toFixed(2)).toString());
    }
//    мне кажется здесь change как-то больше подходит
    $('.order_form').on('change', 'input[type="number"]', function () {
        var target = event.target;
        orderitem_num = parseInt(target.name.replace('orderitems-', '').replace('-quantity', ''));
        orderitem_quantity = parseInt(target.value);

        if (orderitem_quantity >= 0){
            delta_quantity = orderitem_quantity - quantity_arr[orderitem_num];
            quantity_arr[orderitem_num] = orderitem_quantity;
        }
        if (price_arr[orderitem_num]) {
            orderSummaryUpdate(price_arr[orderitem_num], delta_quantity);
        }
    });

    $('.order_form').on('change', 'input[type="checkbox"]', function(){
        var target = event.target;
        orderitem_num = parseInt(target.name.replace('orderitems-', '').replace('-DELETE', ''));
        if (target.checked) {
            delta_quantity = -quantity_arr[orderitem_num];
        } else {
            delta_quantity = quantity_arr[orderitem_num];
        }
        orderSummaryUpdate(price_arr[orderitem_num], delta_quantity);
    });

    function orderSummaryUpdate(orderitem_price, delta_quantity) {
        delta_cost = orderitem_price * delta_quantity;

        order_total_cost = Number((order_total_cost + delta_cost).toFixed(2));
        order_total_quantity = order_total_quantity + delta_quantity;


        $('.order_total_cost').html(order_total_cost.toString());
        $('.order_total_quantity').html(order_total_quantity.toString());
    };

     function deleteOrderItem(row) {
        var target_name= row[0].querySelector('input[type="number"]').name;
        orderitem_num = parseInt(target_name.replace('orderitems-', '').replace('-quantity', ''));
        delta_quantity = -quantity_arr[orderitem_num];
        if (delta_quantity){
            orderSummaryUpdate(price_arr[orderitem_num], delta_quantity);
        }
    }


    $('.order_form select').change(function () {
        var target = event.target;
        // определяем название товара
        var name = target.options[target.selectedIndex].text;
        name = name.replace(name.match(/\s\(.+\)/), '');
        //парсим номер строки
        orderitem_num = parseInt(target.name.replace('orderitems-', '').replace('-product', ''));
        quantity_arr[orderitem_num] = parseInt($('input[name="orderitems-' + orderitem_num + '-quantity"]').val()) || 0;
        //удаляем из общей стоимости стоимость заменяемого товара
        delta_quantity = -quantity_arr[orderitem_num];
        if  (price_arr[orderitem_num]){
            orderSummaryUpdate(price_arr[orderitem_num], delta_quantity);
        }
        //аякс запрос цены по новому имени товара
        if (name) {
            $.ajax(
                {
                    url: '/products/product/' + name + '/price/',
                    success: function (data) {
                        if (data.price) {
                            //сохраняем его цену
                            price_arr[orderitem_num] = parseFloat(data.price);
                            //количество осталось то же, что было у предыдущего имени товара
                            delta_quantity = quantity_arr[orderitem_num] || 0;
                            //перерисовываем цену товара
                            var price_html = '<span>'+ data.price.toString().replace('.', ',') + '</span> руб.';
                            var current_tr = $('.order_form table').find('tr:eq('+ (orderitem_num + 1) + ')');
                            current_tr.find('td:eq(2)').html(price_html);
                            //пересчитываем и отрисовываем новую общую сумму
                            orderSummaryUpdate(price_arr[orderitem_num], delta_quantity);
                        }
                    }
                }
            )
        }
    });

    $('.formset_row').formset({
        addText: 'добавить продукт',
        deleteText: 'удалить',
        prefix: 'orderitems',
        removed: deleteOrderItem
    });
}
