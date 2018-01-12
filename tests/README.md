# Requirements

This test suite attempts to test against all major versions of ES. I haven't found a good/easy/configurable way to toggle some versions on or off, so it just is for now.

* You MUST have the correct versions of ES running that are configured under ``elastichq.config.test_settings.py``.
* ALL clusters must have unique cluster names, for connection pooling tests to pass. 
* There are two scripts I used to start and kill all of my ES clusters on my development server, you can find under ``tests/scripts``.

# Running Tests

I typically run the tests from inside of PyCharm, as it provides a cleaner view of failures, but from command line, you can do: ``manage.py run-tests``