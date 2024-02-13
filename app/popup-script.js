$(() => {
  $(".open-modal-trigger").click(() => {
    $("#submition-popup").modal({
      fadeDuration: 250,
    });

    return false;
  });

  $("#early-access-form").validate({
    errorClass: "error-message",
    rules: {
      firstName: {
        required: true,
        minlength: 2,
      },
      lastName: {
        required: true,
        minlength: 2,
      },
      email: {
        required: true,
        email: true,
      },
    },
    submitHandler: (form) => {
      $("#submit-form").prop("disabled", true);
      const url = "https://whatmoneyapi.azurewebsites.net/user";
      const email = $("#email").val();

      const formData = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        email,
      };

      $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: () => {
          $("#user-email").text(email);
          $("#submit-form").prop("disabled", false);
          $("#thank-you-popup").modal({
            fadeDuration: 250,
          });
          $(form).trigger("reset");
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error("Error:", errorThrown);
        },
      });
    },
  });
});
