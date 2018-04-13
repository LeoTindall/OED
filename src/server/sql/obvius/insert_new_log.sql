/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

INSERT INTO obvius_logs(ip_address, filename, created, hash, contents, processed)
VALUES (${ipAddress}, ${filename}, ${created}, ${hash}, ${contents}, ${processed})
RETURNING id;
